-- Servers table
CREATE TABLE IF NOT EXISTS api.servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_url TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Server members table
CREATE TABLE IF NOT EXISTS api.server_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES api.servers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(server_id, user_id)
);

-- Channels table
CREATE TABLE IF NOT EXISTS api.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES api.servers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for servers
ALTER TABLE api.servers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view servers they are members of"
  ON api.servers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api.server_members
      WHERE server_members.server_id = servers.id
      AND server_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create servers"
  ON api.servers FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Server owners can update their servers"
  ON api.servers FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Server owners can delete their servers"
  ON api.servers FOR DELETE
  USING (auth.uid() = owner_id);

-- RLS Policies for server_members
ALTER TABLE api.server_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view members of servers they belong to"
  ON api.server_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api.server_members sm
      WHERE sm.server_id = server_members.server_id
      AND sm.user_id = auth.uid()
    )
  );

CREATE POLICY "Server owners can add members"
  ON api.server_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM api.servers
      WHERE servers.id = server_members.server_id
      AND servers.owner_id = auth.uid()
    )
  );

CREATE POLICY "Server owners can remove members"
  ON api.server_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM api.servers
      WHERE servers.id = server_members.server_id
      AND servers.owner_id = auth.uid()
    )
  );

CREATE POLICY "Server owners can update member roles"
  ON api.server_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM api.servers
      WHERE servers.id = server_members.server_id
      AND servers.owner_id = auth.uid()
    )
  );

-- RLS Policies for channels
ALTER TABLE api.channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view channels in their servers"
  ON api.channels FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api.server_members
      WHERE server_members.server_id = channels.server_id
      AND server_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Server owners can create channels"
  ON api.channels FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM api.servers
      WHERE servers.id = channels.server_id
      AND servers.owner_id = auth.uid()
    )
  );

CREATE POLICY "Server owners can update channels"
  ON api.channels FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM api.servers
      WHERE servers.id = channels.server_id
      AND servers.owner_id = auth.uid()
    )
  );

CREATE POLICY "Server owners can delete channels"
  ON api.channels FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM api.servers
      WHERE servers.id = channels.server_id
      AND servers.owner_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER servers_updated_at
  BEFORE UPDATE ON api.servers
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at();

CREATE TRIGGER channels_updated_at
  BEFORE UPDATE ON api.channels
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at();
