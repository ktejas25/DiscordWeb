-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view servers they are members of" ON api.servers;
DROP POLICY IF EXISTS "Authenticated users can create servers" ON api.servers;
DROP POLICY IF EXISTS "Server owners can update their servers" ON api.servers;
DROP POLICY IF EXISTS "Server owners can delete their servers" ON api.servers;
DROP POLICY IF EXISTS "Users can view members of servers they belong to" ON api.server_members;
DROP POLICY IF EXISTS "Server owners can add members" ON api.server_members;
DROP POLICY IF EXISTS "Server owners can remove members" ON api.server_members;
DROP POLICY IF EXISTS "Server owners can update member roles" ON api.server_members;

-- Server members policies (simple, no recursion)
CREATE POLICY "Anyone can view server members"
  ON api.server_members FOR SELECT
  USING (true);

CREATE POLICY "Anyone authenticated can insert server members"
  ON api.server_members FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Server owners can remove members"
  ON api.server_members FOR DELETE
  USING (
    server_id IN (SELECT id FROM api.servers WHERE owner_id = auth.uid())
  );

CREATE POLICY "Server owners can update member roles"
  ON api.server_members FOR UPDATE
  USING (
    server_id IN (SELECT id FROM api.servers WHERE owner_id = auth.uid())
  );

-- Servers policies
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
