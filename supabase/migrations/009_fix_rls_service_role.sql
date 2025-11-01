-- Grant service role full access to bypass RLS
GRANT ALL ON api.channel_invitations TO service_role;
GRANT ALL ON api.channel_members TO service_role;
GRANT ALL ON api.channels TO service_role;
GRANT ALL ON api.profiles TO service_role;
GRANT ALL ON api.messages TO service_role;

-- Ensure service role can bypass RLS
ALTER TABLE api.channel_invitations FORCE ROW LEVEL SECURITY;
ALTER TABLE api.channel_members FORCE ROW LEVEL SECURITY;

-- Add policies that allow service role to bypass
DROP POLICY IF EXISTS "Service role bypass" ON api.channel_invitations;
CREATE POLICY "Service role bypass"
  ON api.channel_invitations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role bypass" ON api.channel_members;
CREATE POLICY "Service role bypass"
  ON api.channel_members
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
