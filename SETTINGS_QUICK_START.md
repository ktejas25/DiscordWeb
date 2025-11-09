# Settings Quick Start

## 🚀 Get Settings Working in 2 Minutes

### Step 1: Apply Database Migration

**Option A - Supabase Dashboard (Easiest):**
1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy this SQL and paste it:

```sql
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;

CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);
```

5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

**Option B - Supabase CLI:**
```bash
supabase db push
```

### Step 2: Test It

1. Start your app: `npm run dev`
2. Login to your account
3. Click your profile picture → **Settings**
4. Try toggling any setting (e.g., "Allow Direct Messages")
5. Refresh the page - your setting should persist! ✅

### Step 3: Verify Privacy Enforcement

**Test DM Blocking:**
1. Create two test accounts (User A and User B)
2. Login as User B
3. Go to Settings → Privacy & Safety
4. Turn OFF "Allow Direct Messages"
5. Login as User A
6. Try to send a DM to User B
7. You should see: "This user does not accept direct messages." ✅

**Test Friend Request Blocking:**
1. As User B, turn OFF "Allow Friend Requests"
2. As User A, try to send a friend request to User B
3. You should see: "This user does not accept friend requests." ✅

## ✅ That's It!

All settings are now working:
- ✅ Privacy toggles block DMs and friend requests
- ✅ Voice slider is functional
- ✅ Notifications request browser permissions
- ✅ Theme and font-size apply immediately
- ✅ Reduced motion disables animations
- ✅ Keybinds can be recorded (press Escape to cancel)
- ✅ 15 languages available
- ✅ Changelog shows v1.1.0 updates

## 🐛 Troubleshooting

**Still getting "permission denied" errors?**

1. Make sure you're logged in (check if `auth.uid()` returns your user ID)
2. Verify the table exists:
   ```sql
   SELECT * FROM user_settings LIMIT 1;
   ```
3. Check RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'user_settings';
   ```
4. Verify policies exist:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'user_settings';
   ```

**Settings not persisting?**

- Check browser console for errors
- Verify your Supabase connection in `.env`
- Make sure you're authenticated

**Need help?**

See full documentation in:
- `SETTINGS_IMPLEMENTATION_COMPLETE.md` - Complete feature list
- `SETTINGS_USAGE_GUIDE.md` - Developer guide
- `apply-settings-migration.md` - Detailed migration instructions
