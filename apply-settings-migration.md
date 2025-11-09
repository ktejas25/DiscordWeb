# Apply User Settings Migration

## Option 1: Using Supabase CLI (Recommended)

```bash
# Make sure you're in the project directory
cd aura-oasis

# Apply the migration
supabase db push
```

## Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/011_user_settings_table.sql`
5. Click **Run**

## Option 3: Manual SQL Execution

Run this SQL in your Supabase SQL Editor:

```sql
-- Create user_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Service role has full access to user_settings" ON user_settings;

-- Allow users to read their own settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own settings
CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own settings
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow service role full access
CREATE POLICY "Service role has full access to user_settings"
  ON user_settings FOR ALL
  USING (auth.role() = 'service_role');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Verify Migration

After applying, verify the table exists:

```sql
SELECT * FROM user_settings LIMIT 1;
```

You should see the table structure with no permission errors.

## What This Migration Does

1. **Creates `user_settings` table** with:
   - `user_id` (UUID, primary key, references auth.users)
   - `settings` (JSONB, stores all user settings)
   - `created_at` and `updated_at` timestamps

2. **Enables Row Level Security (RLS)** to protect user data

3. **Creates RLS policies**:
   - Users can only read their own settings
   - Users can only insert their own settings
   - Users can only update their own settings
   - Service role has full access (for backend operations)

4. **Creates trigger** to automatically update `updated_at` timestamp

## Troubleshooting

If you still get permission errors after applying:

1. Check if RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'user_settings';
   ```

2. Check if policies exist:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'user_settings';
   ```

3. Verify you're authenticated:
   ```sql
   SELECT auth.uid();
   ```
   Should return your user ID, not NULL.
