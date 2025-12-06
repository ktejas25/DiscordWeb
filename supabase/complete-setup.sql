-- ============================================
-- COMPLETE SUPABASE DATABASE SETUP
-- Run this in your Supabase SQL Editor
-- ============================================

-- Create api schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS api;

-- ============================================
-- 1. PROFILES AND SETTINGS
-- ============================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS api.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User settings table
CREATE TABLE IF NOT EXISTS api.user_settings (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark',
  locale TEXT DEFAULT 'en',
  reduced_motion BOOLEAN DEFAULT FALSE,
  notifications JSONB DEFAULT '{"enabled": true, "sound": true}'::jsonb,
  privacy JSONB DEFAULT '{}'::jsonb,
  voice JSONB DEFAULT '{}'::jsonb,
  text_images JSONB DEFAULT '{}'::jsonb,
  appearance JSONB DEFAULT '{}'::jsonb,
  accessibility JSONB DEFAULT '{}'::jsonb,
  keybinds JSONB DEFAULT '{}'::jsonb,
  advanced JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. SERVERS, CHANNELS, AND MEMBERS
-- ============================================

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

-- Messages table
CREATE TABLE IF NOT EXISTS api.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES api.channels(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. DM CONVERSATIONS
-- ============================================

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

-- ============================================
-- 4. FRIENDS AND INVITATIONS
-- ============================================

-- Friends table
CREATE TABLE IF NOT EXISTS api.friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Channel invitations table
CREATE TABLE IF NOT EXISTS api.channel_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES api.channels(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_messages_channel ON api.messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_dm_participants_user ON api.dm_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_dm_participants_conversation ON api.dm_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_dm_messages_conversation ON api.dm_messages(conversation_id);

-- ============================================
-- 6. FUNCTIONS
-- ============================================

-- Function to update updated_at
CREATE OR REPLACE FUNCTION api.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 7. TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS profiles_updated_at ON api.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON api.profiles
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at();

DROP TRIGGER IF EXISTS user_settings_updated_at ON api.user_settings;
CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON api.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at();

DROP TRIGGER IF EXISTS servers_updated_at ON api.servers;
CREATE TRIGGER servers_updated_at
  BEFORE UPDATE ON api.servers
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at();

DROP TRIGGER IF EXISTS channels_updated_at ON api.channels;
CREATE TRIGGER channels_updated_at
  BEFORE UPDATE ON api.channels
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at();

DROP TRIGGER IF EXISTS dm_conversations_updated_at ON api.dm_conversations;
CREATE TRIGGER dm_conversations_updated_at
  BEFORE UPDATE ON api.dm_conversations
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at();

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Profiles RLS
ALTER TABLE api.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all profiles" ON api.profiles;
CREATE POLICY "Users can view all profiles"
  ON api.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON api.profiles;
CREATE POLICY "Users can update own profile"
  ON api.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON api.profiles;
CREATE POLICY "Users can insert own profile"
  ON api.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User Settings RLS
ALTER TABLE api.user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own settings" ON api.user_settings;
CREATE POLICY "Users can view own settings"
  ON api.user_settings FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own settings" ON api.user_settings;
CREATE POLICY "Users can update own settings"
  ON api.user_settings FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own settings" ON api.user_settings;
CREATE POLICY "Users can insert own settings"
  ON api.user_settings FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Servers RLS
ALTER TABLE api.servers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view servers they are members of" ON api.servers;
CREATE POLICY "Users can view servers they are members of"
  ON api.servers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api.server_members
      WHERE server_members.server_id = servers.id
      AND server_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create servers" ON api.servers;
CREATE POLICY "Authenticated users can create servers"
  ON api.servers FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Server owners can update their servers" ON api.servers;
CREATE POLICY "Server owners can update their servers"
  ON api.servers FOR UPDATE
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Server owners can delete their servers" ON api.servers;
CREATE POLICY "Server owners can delete their servers"
  ON api.servers FOR DELETE
  USING (auth.uid() = owner_id);

-- Server Members RLS
ALTER TABLE api.server_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view members of servers they belong to" ON api.server_members;
CREATE POLICY "Users can view members of servers they belong to"
  ON api.server_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api.server_members sm
      WHERE sm.server_id = server_members.server_id
      AND sm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Server owners can add members" ON api.server_members;
CREATE POLICY "Server owners can add members"
  ON api.server_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM api.servers
      WHERE servers.id = server_members.server_id
      AND servers.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Server owners can remove members" ON api.server_members;
CREATE POLICY "Server owners can remove members"
  ON api.server_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM api.servers
      WHERE servers.id = server_members.server_id
      AND servers.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Server owners can update member roles" ON api.server_members;
CREATE POLICY "Server owners can update member roles"
  ON api.server_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM api.servers
      WHERE servers.id = server_members.server_id
      AND servers.owner_id = auth.uid()
    )
  );

-- Channels RLS
ALTER TABLE api.channels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view channels in their servers" ON api.channels;
CREATE POLICY "Users can view channels in their servers"
  ON api.channels FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api.server_members
      WHERE server_members.server_id = channels.server_id
      AND server_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Server owners can create channels" ON api.channels;
CREATE POLICY "Server owners can create channels"
  ON api.channels FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM api.servers
      WHERE servers.id = channels.server_id
      AND servers.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Server owners can update channels" ON api.channels;
CREATE POLICY "Server owners can update channels"
  ON api.channels FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM api.servers
      WHERE servers.id = channels.server_id
      AND servers.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Server owners can delete channels" ON api.channels;
CREATE POLICY "Server owners can delete channels"
  ON api.channels FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM api.servers
      WHERE servers.id = channels.server_id
      AND servers.owner_id = auth.uid()
    )
  );

-- Messages RLS
ALTER TABLE api.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in their channels" ON api.messages;
CREATE POLICY "Users can view messages in their channels"
  ON api.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM api.channels c
      JOIN api.server_members sm ON sm.server_id = c.server_id
      WHERE c.id = messages.channel_id
      AND sm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can send messages" ON api.messages;
CREATE POLICY "Users can send messages"
  ON api.messages FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update own messages" ON api.messages;
CREATE POLICY "Users can update own messages"
  ON api.messages FOR UPDATE
  USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own messages" ON api.messages;
CREATE POLICY "Users can delete own messages"
  ON api.messages FOR DELETE
  USING (auth.uid() = author_id);

-- DM Conversations RLS
ALTER TABLE api.dm_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view conversations they're part of" ON api.dm_conversations;
CREATE POLICY "Users can view conversations they're part of"
  ON api.dm_conversations FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can create conversations" ON api.dm_conversations;
CREATE POLICY "Users can create conversations"
  ON api.dm_conversations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- DM Participants RLS
ALTER TABLE api.dm_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view participants" ON api.dm_participants;
CREATE POLICY "Users can view participants"
  ON api.dm_participants FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can add participants" ON api.dm_participants;
CREATE POLICY "Users can add participants"
  ON api.dm_participants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- DM Messages RLS
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

-- Friends RLS
ALTER TABLE api.friends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their friends" ON api.friends;
CREATE POLICY "Users can view their friends"
  ON api.friends FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "Users can add friends" ON api.friends;
CREATE POLICY "Users can add friends"
  ON api.friends FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update friend status" ON api.friends;
CREATE POLICY "Users can update friend status"
  ON api.friends FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "Users can remove friends" ON api.friends;
CREATE POLICY "Users can remove friends"
  ON api.friends FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Channel Invitations RLS
ALTER TABLE api.channel_invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their invitations" ON api.channel_invitations;
CREATE POLICY "Users can view their invitations"
  ON api.channel_invitations FOR SELECT
  USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

DROP POLICY IF EXISTS "Users can create invitations" ON api.channel_invitations;
CREATE POLICY "Users can create invitations"
  ON api.channel_invitations FOR INSERT
  WITH CHECK (auth.uid() = inviter_id);

DROP POLICY IF EXISTS "Users can update invitations" ON api.channel_invitations;
CREATE POLICY "Users can update invitations"
  ON api.channel_invitations FOR UPDATE
  USING (auth.uid() = invitee_id);

-- ============================================
-- 9. STORAGE BUCKETS
-- ============================================

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- SETUP COMPLETE!
-- ============================================
