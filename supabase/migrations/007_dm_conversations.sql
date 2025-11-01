-- DM Conversations table
CREATE TABLE IF NOT EXISTS api.dm_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_group BOOLEAN DEFAULT FALSE,
  name TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DM Participants table
CREATE TABLE IF NOT EXISTS api.dm_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES api.dm_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- DM Messages table
CREATE TABLE IF NOT EXISTS api.dm_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES api.dm_conversations(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dm_participants_user ON api.dm_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_dm_participants_conversation ON api.dm_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_dm_messages_conversation ON api.dm_messages(conversation_id);

-- RLS Policies for dm_conversations
ALTER TABLE api.dm_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view conversations they're part of" ON api.dm_conversations;
CREATE POLICY "Users can view conversations they're part of"
  ON api.dm_conversations FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can create conversations" ON api.dm_conversations;
CREATE POLICY "Users can create conversations"
  ON api.dm_conversations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for dm_participants
ALTER TABLE api.dm_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view participants" ON api.dm_participants;
CREATE POLICY "Users can view participants"
  ON api.dm_participants FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can add participants" ON api.dm_participants;
CREATE POLICY "Users can add participants"
  ON api.dm_participants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for dm_messages
ALTER TABLE api.dm_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages" ON api.dm_messages;
CREATE POLICY "Users can view messages"
  ON api.dm_messages FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can send messages" ON api.dm_messages;
CREATE POLICY "Users can send messages"
  ON api.dm_messages FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update own messages" ON api.dm_messages;
CREATE POLICY "Users can update own messages"
  ON api.dm_messages FOR UPDATE
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can delete own messages" ON api.dm_messages;
CREATE POLICY "Users can delete own messages"
  ON api.dm_messages FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION api.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on dm_conversations
DROP TRIGGER IF EXISTS dm_conversations_updated_at ON api.dm_conversations;
CREATE TRIGGER dm_conversations_updated_at
  BEFORE UPDATE ON api.dm_conversations
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at();
