# Settings Feature Setup Guide

## Quick Start

### Step 1: Run Database Migration

1. Open Supabase Dashboard: https://app.supabase.com
2. Select your project: `vohhrarsjugvmhcckejy`
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the contents of `supabase/migrations/001_profiles_and_settings.sql`
6. Click **Run** or press `Ctrl+Enter`

### Step 2: Verify Storage Bucket

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. You should see an `avatars` bucket
3. Click on `avatars` → **Policies** tab
4. Verify these policies exist:
   - "Avatar images are publicly accessible" (SELECT)
   - "Users can upload own avatar" (INSERT)
   - "Users can update own avatar" (UPDATE)
   - "Users can delete own avatar" (DELETE)

### Step 3: Test the Feature

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Log in to your app

3. Click the **gear icon** in the bottom-left corner (next to your username)

4. The Settings overlay should open

5. Navigate to **Profile** section

6. Test the following:
   - Upload an avatar (PNG/JPG/WebP, max 5MB)
   - Change your username (try a duplicate to test validation)
   - Add a bio (max 300 characters)
   - Click **Save Changes**

7. Refresh the page and verify:
   - Your avatar appears in the bottom-left
   - Your username is updated
   - Settings persist

### Step 4: Test Other Settings

1. **Appearance** → Change theme (dark/light/system)
2. **Notifications** → Toggle notification settings
3. **Accessibility** → Enable reduced motion
4. **Language** → Change locale
5. Verify all changes persist after page reload

## Troubleshooting

### Migration Fails
- Check if tables already exist: `SELECT * FROM api.profiles LIMIT 1;`
- If they exist, you can skip the migration or drop tables first
- Ensure you're running the query in the correct schema (`api`)

### Avatar Upload Fails
- Check browser console for errors
- Verify storage bucket exists and is public
- Check RLS policies are enabled
- Ensure file is <5MB and correct format

### Username Conflict Not Detected
- Verify unique constraint exists: `\d api.profiles` in SQL editor
- Check error handling in ProfilePage.tsx

### Settings Don't Persist
- Check browser console for Supabase errors
- Verify RLS policies allow user to update their own settings
- Check network tab for failed requests

## Manual Testing Checklist

- [ ] Gear icon opens settings overlay
- [ ] ESC key closes overlay
- [ ] Click outside closes overlay
- [ ] All 12 sections render without errors
- [ ] Avatar upload works (PNG/JPG/WebP)
- [ ] Avatar upload rejects files >5MB
- [ ] Avatar upload rejects invalid formats
- [ ] Username validation works (length, chars, uniqueness)
- [ ] Bio character counter works (max 300)
- [ ] Save button disables while saving
- [ ] Success toast appears on save
- [ ] Error toast appears on failure
- [ ] Changes persist after page reload
- [ ] Theme toggle works
- [ ] Locale selector works
- [ ] All toggles persist in user_settings
- [ ] Log out button works
- [ ] Profile changes reflect in SelfFooter avatar

## Database Schema Verification

Run these queries in Supabase SQL Editor to verify setup:

```sql
-- Check profiles table
SELECT * FROM api.profiles LIMIT 5;

-- Check user_settings table
SELECT * FROM api.user_settings LIMIT 5;

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'avatars';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('profiles', 'user_settings');
```

## Next Steps

After successful setup:

1. Customize theme colors in `tailwind.config.ts`
2. Add more settings fields as needed
3. Implement password change flow
4. Add delete account confirmation
5. Implement keybind editor
6. Add voice device selection
