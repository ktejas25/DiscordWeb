-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view server roles" ON api.server_roles;
DROP POLICY IF EXISTS "Server owners can create roles" ON api.server_roles;
DROP POLICY IF EXISTS "Server owners can update roles" ON api.server_roles;
DROP POLICY IF EXISTS "Server owners can delete roles" ON api.server_roles;
DROP POLICY IF EXISTS "Anyone can view member roles" ON api.member_roles;
DROP POLICY IF EXISTS "Server owners can assign roles" ON api.member_roles;
DROP POLICY IF EXISTS "Server owners can remove roles" ON api.member_roles;

-- Recreate policies with correct permissions
CREATE POLICY "Users can view roles in their servers"
  ON api.server_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api.server_members
      WHERE server_members.server_id = server_roles.server_id
      AND server_members.user_id = auth.uid()
    )
  );

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

CREATE POLICY "Users can view member roles in their servers"
  ON api.member_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api.server_members
      WHERE server_members.server_id = member_roles.server_id
      AND server_members.user_id = auth.uid()
    )
  );

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
