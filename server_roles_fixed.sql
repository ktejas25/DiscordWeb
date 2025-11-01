-- ============================================
-- ENABLE EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: api.servers table already exists, just adding description column if missing
ALTER TABLE api.servers ADD COLUMN IF NOT EXISTS description TEXT;

-- ============================================
-- SERVER ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS api.server_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID REFERENCES api.servers(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#99AAB5' CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  category VARCHAR(50) NOT NULL CHECK (category IN ('administration', 'community', 'interest', 'notification', 'aesthetic', 'bot')),
  position INTEGER DEFAULT 0,
  permissions JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  is_mentionable BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(server_id, name)
);

-- ============================================
-- SERVER MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS api.server_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID REFERENCES api.servers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  nickname VARCHAR(100),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(server_id, user_id)
);

-- ============================================
-- MEMBER ROLES TABLE (Role Assignments)
-- ============================================
CREATE TABLE IF NOT EXISTS api.member_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_member_id UUID REFERENCES api.server_members(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES api.server_roles(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(server_member_id, role_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_servers_owner ON api.servers(owner_id);
CREATE INDEX IF NOT EXISTS idx_server_roles_server ON api.server_roles(server_id);
CREATE INDEX IF NOT EXISTS idx_server_roles_position ON api.server_roles(server_id, position DESC);
CREATE INDEX IF NOT EXISTS idx_server_roles_default ON api.server_roles(server_id, is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_server_members_server ON api.server_members(server_id);
CREATE INDEX IF NOT EXISTS idx_server_members_user ON api.server_members(user_id);
CREATE INDEX IF NOT EXISTS idx_member_roles_member ON api.member_roles(server_member_id);
CREATE INDEX IF NOT EXISTS idx_member_roles_role ON api.member_roles(role_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to check if user is server owner
CREATE OR REPLACE FUNCTION api.is_server_owner(server_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM api.servers 
    WHERE id = server_uuid AND owner_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has administrator permission
CREATE OR REPLACE FUNCTION api.has_admin_permission(server_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Owner always has admin permission
  IF api.is_server_owner(server_uuid, user_uuid) THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user has admin or manage_roles permission
  RETURN EXISTS (
    SELECT 1 
    FROM api.server_members sm
    JOIN api.member_roles mr ON mr.server_member_id = sm.id
    JOIN api.server_roles sr ON sr.id = mr.role_id
    WHERE sm.server_id = server_uuid 
    AND sm.user_id = user_uuid
    AND (
      sr.permissions->>'administrator' = 'true'
      OR sr.permissions->>'manage_roles' = 'true'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's highest role position
CREATE OR REPLACE FUNCTION api.get_highest_role_position(server_uuid UUID, user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  max_position INTEGER;
BEGIN
  SELECT COALESCE(MAX(sr.position), 0) INTO max_position
  FROM api.server_members sm
  JOIN api.member_roles mr ON mr.server_member_id = sm.id
  JOIN api.server_roles sr ON sr.id = mr.role_id
  WHERE sm.server_id = server_uuid AND sm.user_id = user_uuid;
  
  RETURN max_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can manage target role
CREATE OR REPLACE FUNCTION api.can_manage_role(server_uuid UUID, user_uuid UUID, target_role_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  target_position INTEGER;
  user_position INTEGER;
BEGIN
  -- Owner can manage all roles
  IF api.is_server_owner(server_uuid, user_uuid) THEN
    RETURN TRUE;
  END IF;
  
  -- Must have admin permission
  IF NOT api.has_admin_permission(server_uuid, user_uuid) THEN
    RETURN FALSE;
  END IF;
  
  -- Get target role position
  SELECT position INTO target_position
  FROM api.server_roles
  WHERE id = target_role_id;
  
  -- Get user's highest position
  user_position := api.get_highest_role_position(server_uuid, user_uuid);
  
  -- Can only manage roles with lower position
  RETURN target_position < user_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE api.servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.server_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.server_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.member_roles ENABLE ROW LEVEL SECURITY;

-- SERVERS POLICIES
CREATE POLICY "Users can view servers they are members of"
  ON api.servers FOR SELECT
  USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM api.server_members
      WHERE server_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Only owner can update server"
  ON api.servers FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Anyone can create server"
  ON api.servers FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Only owner can delete server"
  ON api.servers FOR DELETE
  USING (auth.uid() = owner_id);

-- SERVER ROLES POLICIES
CREATE POLICY "Members can view server roles"
  ON api.server_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api.server_members
      WHERE server_id = server_roles.server_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can create roles"
  ON api.server_roles FOR INSERT
  WITH CHECK (api.has_admin_permission(server_id, auth.uid()));

CREATE POLICY "Admins can update roles they can manage"
  ON api.server_roles FOR UPDATE
  USING (api.can_manage_role(server_id, auth.uid(), id));

CREATE POLICY "Admins can delete roles they can manage"
  ON api.server_roles FOR DELETE
  USING (api.can_manage_role(server_id, auth.uid(), id));

-- SERVER MEMBERS POLICIES
CREATE POLICY "Members can view other members"
  ON api.server_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api.server_members sm
      WHERE sm.server_id = server_members.server_id AND sm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join servers (via invitation)"
  ON api.server_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can leave servers"
  ON api.server_members FOR DELETE
  USING (auth.uid() = user_id);

-- MEMBER ROLES POLICIES
CREATE POLICY "Members can view role assignments"
  ON api.member_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api.server_members sm
      JOIN api.server_roles sr ON sr.server_id = sm.server_id
      WHERE sm.user_id = auth.uid()
      AND member_roles.role_id = sr.id
    )
  );

CREATE POLICY "Admins can assign roles they can manage"
  ON api.member_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM api.server_members sm
      JOIN api.server_roles sr ON sr.id = role_id
      WHERE sm.id = server_member_id
      AND api.can_manage_role(sr.server_id, auth.uid(), role_id)
    )
  );

CREATE POLICY "Admins can remove roles they can manage"
  ON api.member_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM api.server_members sm
      JOIN api.server_roles sr ON sr.id = member_roles.role_id
      WHERE sm.id = member_roles.server_member_id
      AND api.can_manage_role(sr.server_id, auth.uid(), member_roles.role_id)
    )
  );

-- ============================================
-- INSERT DEFAULT ROLES FOR A SERVER
-- ============================================

-- Function to create default roles when server is created
CREATE OR REPLACE FUNCTION api.create_default_server_roles()
RETURNS TRIGGER AS $$
DECLARE
  new_server_id UUID := NEW.id;
  member_role_id UUID;
  owner_member_id UUID;
BEGIN
  -- Insert default roles
  INSERT INTO api.server_roles (server_id, name, color, category, position, permissions, is_mentionable) VALUES
  -- ADMINISTRATION ROLES
  (new_server_id, 'Server Owner', '#FF0000', 'administration', 100, '{"administrator": true, "manage_server": true, "manage_roles": true, "manage_channels": true, "kick_members": true, "ban_members": true, "manage_messages": true}'::jsonb, false),
  (new_server_id, 'Administrator', '#FF4500', 'administration', 90, '{"administrator": true, "manage_server": true, "manage_roles": true, "manage_channels": true, "kick_members": true, "ban_members": true}'::jsonb, false),
  (new_server_id, 'Head Moderator', '#FFA500', 'administration', 80, '{"manage_messages": true, "kick_members": true, "ban_members": true, "timeout_members": true, "manage_nicknames": true}'::jsonb, false),
  (new_server_id, 'Moderator', '#FFD700', 'administration', 70, '{"manage_messages": true, "kick_members": true, "timeout_members": true, "mute_members": true}'::jsonb, false),
  (new_server_id, 'Support', '#00CED1', 'administration', 60, '{"manage_messages": true, "timeout_members": true}'::jsonb, false),
  
  -- COMMUNITY ROLES
  (new_server_id, 'Veteran', '#9B59B6', 'community', 50, '{}'::jsonb, false),
  (new_server_id, 'Active Member', '#3498DB', 'community', 40, '{}'::jsonb, false),
  (new_server_id, 'Verified Member', '#2ECC71', 'community', 30, '{}'::jsonb, false),
  (new_server_id, 'Member', '#95A5A6', 'community', 20, '{}'::jsonb, true),
  (new_server_id, 'Newcomer', '#BDC3C7', 'community', 10, '{}'::jsonb, false),
  
  -- INTEREST ROLES
  (new_server_id, 'Gamers', '#E91E63', 'interest', 5, '{}'::jsonb, false),
  (new_server_id, 'Artists', '#FF6B9D', 'interest', 5, '{}'::jsonb, false),
  (new_server_id, 'Writers', '#4A90E2', 'interest', 5, '{}'::jsonb, false),
  (new_server_id, 'Musicians', '#9C27B0', 'interest', 5, '{}'::jsonb, false),
  (new_server_id, 'Streamers', '#6441A5', 'interest', 5, '{}'::jsonb, false),
  (new_server_id, 'Developers', '#00D9FF', 'interest', 5, '{}'::jsonb, false),
  (new_server_id, 'Students', '#FFC107', 'interest', 5, '{}'::jsonb, false),
  (new_server_id, 'Readers', '#8BC34A', 'interest', 5, '{}'::jsonb, false),
  
  -- NOTIFICATION ROLES
  (new_server_id, 'Announcements Ping', '#E74C3C', 'notification', 3, '{}'::jsonb, true),
  (new_server_id, 'Events Ping', '#F39C12', 'notification', 3, '{}'::jsonb, true),
  (new_server_id, 'Giveaways Ping', '#1ABC9C', 'notification', 3, '{}'::jsonb, true),
  (new_server_id, 'Stream Ping', '#E67E22', 'notification', 3, '{}'::jsonb, true),
  (new_server_id, 'Updates Ping', '#3498DB', 'notification', 3, '{}'::jsonb, true),
  
  -- AESTHETIC ROLES (Colors)
  (new_server_id, 'Red', '#E74C3C', 'aesthetic', 1, '{}'::jsonb, false),
  (new_server_id, 'Blue', '#3498DB', 'aesthetic', 1, '{}'::jsonb, false),
  (new_server_id, 'Green', '#2ECC71', 'aesthetic', 1, '{}'::jsonb, false),
  (new_server_id, 'Gold', '#F1C40F', 'aesthetic', 1, '{}'::jsonb, false),
  (new_server_id, 'Purple', '#9B59B6', 'aesthetic', 1, '{}'::jsonb, false),
  (new_server_id, 'Pink', '#FF6B9D', 'aesthetic', 1, '{}'::jsonb, false),
  
  -- BOT ROLES
  (new_server_id, 'Bots', '#7289DA', 'bot', 2, '{}'::jsonb, false),
  (new_server_id, 'Muted', '#95A5A6', 'bot', 0, '{"send_messages": false, "speak": false}'::jsonb, false);
  
  -- Mark Member role as default
  UPDATE api.server_roles 
  SET is_default = true 
  WHERE server_id = new_server_id AND name = 'Member';
  
  -- Add owner as server member
  INSERT INTO api.server_members (server_id, user_id)
  VALUES (new_server_id, NEW.owner_id)
  RETURNING id INTO owner_member_id;
  
  -- Assign Server Owner role to creator
  INSERT INTO api.member_roles (server_member_id, role_id, assigned_by)
  SELECT owner_member_id, sr.id, NEW.owner_id
  FROM api.server_roles sr
  WHERE sr.server_id = new_server_id 
  AND sr.name = 'Server Owner';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default roles
DROP TRIGGER IF EXISTS create_server_default_roles ON api.servers;
CREATE TRIGGER create_server_default_roles
  AFTER INSERT ON api.servers
  FOR EACH ROW
  EXECUTE FUNCTION api.create_default_server_roles();

-- ============================================
-- AUTO-ASSIGN DEFAULT ROLE TO NEW MEMBERS
-- ============================================

-- Function to auto-assign default role when member joins
CREATE OR REPLACE FUNCTION api.assign_default_role_to_member()
RETURNS TRIGGER AS $$
BEGIN
  -- Assign default role(s) to new member
  INSERT INTO api.member_roles (server_member_id, role_id)
  SELECT NEW.id, sr.id
  FROM api.server_roles sr
  WHERE sr.server_id = NEW.server_id 
  AND sr.is_default = true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to assign default role
DROP TRIGGER IF EXISTS assign_default_role ON api.server_members;
CREATE TRIGGER assign_default_role
  AFTER INSERT ON api.server_members
  FOR EACH ROW
  EXECUTE FUNCTION api.assign_default_role_to_member();

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================

-- Function for updated_at (if not exists)
CREATE OR REPLACE FUNCTION api.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_servers_updated_at ON api.servers;
CREATE TRIGGER update_servers_updated_at
  BEFORE UPDATE ON api.servers
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at_column();
