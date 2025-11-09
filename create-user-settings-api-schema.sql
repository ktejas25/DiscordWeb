-- Create user_settings table in the api schema
CREATE TABLE IF NOT EXISTS api.user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE api.user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own settings" ON api.user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON api.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON api.user_settings;

-- Create policies
CREATE POLICY "Users can view own settings"
  ON api.user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON api.user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON api.user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON api.user_settings TO authenticated;
GRANT ALL ON api.user_settings TO service_role;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION api.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON api.user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON api.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION api.update_updated_at_column();
