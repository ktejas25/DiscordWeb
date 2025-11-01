-- Server Roles Table
CREATE TABLE IF NOT EXISTS api.server_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES api.servers(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#99AAB5',
  position INTEGER DEFAULT 0,
  category VARCHAR(50),
  permissions JSONB DEFAULT '{}',
  mentionable BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(server_id, name)
);

-- Member Roles Junction Table
CREATE TABLE IF NOT EXISTS api.member_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES api.servers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES api.server_roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role_id, server_id)
);

-- Add nickname column to existing server_members table
ALTER TABLE api.server_members ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_server_roles_server ON api.server_roles(server_id);
CREATE INDEX IF NOT EXISTS idx_member_roles_user ON api.member_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_member_roles_server ON api.member_roles(server_id);

-- RLS Policies for server_roles
ALTER TABLE api.server_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view server roles"
  ON api.server_roles FOR SELECT
  USING (true);

CREATE POLICY "Server owners can create roles"
  ON api.server_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM api.servers 
      WHERE servers.id = server_roles.server_id 
      AND servers.owner_id = auth.uid()
    )
  );

CREATE POLICY "Server owners can update roles"
  ON api.server_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM api.servers 
      WHERE servers.id = server_roles.server_id 
      AND servers.owner_id = auth.uid()
    )
  );

CREATE POLICY "Server owners can delete roles"
  ON api.server_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM api.servers 
      WHERE servers.id = server_roles.server_id 
      AND servers.owner_id = auth.uid()
    )
  );

-- RLS Policies for member_roles
ALTER TABLE api.member_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view member roles"
  ON api.member_roles FOR SELECT
  USING (true);

CREATE POLICY "Server owners can assign roles"
  ON api.member_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM api.servers 
      WHERE servers.id = member_roles.server_id 
      AND servers.owner_id = auth.uid()
    )
  );

CREATE POLICY "Server owners can remove roles"
  ON api.member_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM api.servers 
      WHERE servers.id = member_roles.server_id 
      AND servers.owner_id = auth.uid()
    )
  );

-- Function to create default roles for new servers
CREATE OR REPLACE FUNCTION create_default_server_roles()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO api.server_roles (server_id, name, color, position, category, permissions)
  VALUES 
    (NEW.id, '@everyone', '#99AAB5', 0, 'Aesthetic', '{"send_messages": true, "speak": true}'::jsonb),
    (NEW.id, 'Admin', '#E74C3C', 10, 'Admin', '{"administrator": true}'::jsonb),
    (NEW.id, 'Moderator', '#3498DB', 9, 'Admin', '{"manage_messages": true, "kick_members": true, "timeout_members": true, "mute_members": true}'::jsonb);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_server_default_roles
  AFTER INSERT ON api.servers
  FOR EACH ROW
  EXECUTE FUNCTION create_default_server_roles();

-- Function to auto-assign @everyone role to new members
CREATE OR REPLACE FUNCTION assign_everyone_role()
RETURNS TRIGGER AS $$
DECLARE
  everyone_role_id UUID;
BEGIN
  SELECT id INTO everyone_role_id
  FROM api.server_roles
  WHERE server_id = NEW.server_id AND name = '@everyone';
  
  IF everyone_role_id IS NOT NULL THEN
    INSERT INTO api.member_roles (server_id, user_id, role_id, assigned_by)
    VALUES (NEW.server_id, NEW.user_id, everyone_role_id, NEW.user_id)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assign_everyone_role_trigger
  AFTER INSERT ON api.server_members
  FOR EACH ROW
  EXECUTE FUNCTION assign_everyone_role();
