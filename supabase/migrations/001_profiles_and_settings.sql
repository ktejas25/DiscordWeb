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

-- RLS Policies for profiles
ALTER TABLE api.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON api.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON api.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON api.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_settings
ALTER TABLE api.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON api.user_settings FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own settings"
  ON api.user_settings FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own settings"
  ON api.user_settings FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION api.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON api.profiles
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at();

CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON api.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at();

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
