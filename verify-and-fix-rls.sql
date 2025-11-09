-- First, verify the table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'user_settings'
);

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_settings';

-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'user_settings';

-- Check current user
SELECT auth.uid(), auth.role();

-- Now let's fix the policies - drop all and recreate
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Service role has full access to user_settings" ON user_settings;

-- Create comprehensive policies
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow service role bypass RLS
ALTER TABLE user_settings FORCE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON user_settings TO authenticated;
GRANT ALL ON user_settings TO service_role;

-- Test query (should work if you're logged in)
SELECT * FROM user_settings WHERE user_id = auth.uid();
