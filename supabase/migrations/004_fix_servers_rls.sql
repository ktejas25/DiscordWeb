-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
  -- Drop existing server policies
  DROP POLICY IF EXISTS "Users can view servers they are members of" ON api.servers;
  DROP POLICY IF EXISTS "Authenticated users can create servers" ON api.servers;
  DROP POLICY IF EXISTS "Server owners can update their servers" ON api.servers;
  DROP POLICY IF EXISTS "Server owners can delete their servers" ON api.servers;
  
  -- Drop existing server_members policies
  DROP POLICY IF EXISTS "Users can view members of servers they belong to" ON api.server_members;
  DROP POLICY IF EXISTS "Server owners can add members" ON api.server_members;
  DROP POLICY IF EXISTS "Server owners can remove members" ON api.server_members;
  DROP POLICY IF EXISTS "Server owners can update member roles" ON api.server_members;
END $$;

-- Enable RLS
ALTER TABLE api.servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE api.server_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for servers
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
