-- Create channel_invitations table
CREATE TABLE IF NOT EXISTS api.channel_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES api.channels(id) ON DELETE CASCADE,
  inviter_id UUID REFERENCES api.profiles(id) ON DELETE CASCADE,
  invitee_id UUID REFERENCES api.profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, invitee_id)
);

-- Create channel_members table
CREATE TABLE IF NOT EXISTS api.channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES api.channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES api.profiles(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(channel_id, user_id)
);

-- Add channel_id to messages table (if not already exists)
ALTER TABLE api.messages 
ADD COLUMN IF NOT EXISTS channel_id UUID REFERENCES api.channels(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_channel_invitations_invitee ON api.channel_invitations(invitee_id, status);
CREATE INDEX IF NOT EXISTS idx_channel_invitations_channel ON api.channel_invitations(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_members_channel ON api.channel_members(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_members_user ON api.channel_members(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON api.messages(channel_id);

-- Create updated_at trigger for channel_invitations (reuse existing function)
DROP TRIGGER IF EXISTS update_channel_invitations_updated_at ON api.channel_invitations;
CREATE TRIGGER update_channel_invitations_updated_at
  BEFORE UPDATE ON api.channel_invitations
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at();

-- RLS Policies for channel_invitations
ALTER TABLE api.channel_invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their invitations" ON api.channel_invitations;
CREATE POLICY "Users can view their invitations"
  ON api.channel_invitations FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can create invitations" ON api.channel_invitations;
CREATE POLICY "Users can create invitations"
  ON api.channel_invitations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update their invitations" ON api.channel_invitations;
CREATE POLICY "Users can update their invitations"
  ON api.channel_invitations FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- RLS Policies for channel_members
ALTER TABLE api.channel_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view channel members" ON api.channel_members;
CREATE POLICY "Users can view channel members"
  ON api.channel_members FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can add members" ON api.channel_members;
CREATE POLICY "Users can add members"
  ON api.channel_members FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can remove themselves" ON api.channel_members;
CREATE POLICY "Users can remove themselves"
  ON api.channel_members FOR DELETE
  USING (auth.uid() IS NOT NULL);
