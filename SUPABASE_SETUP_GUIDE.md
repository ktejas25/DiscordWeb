# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `aura-oasis`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

## Step 2: Run Database Setup

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `supabase/complete-setup.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)
6. Wait for "Success. No rows returned" message

## Step 3: Get Your Credentials

1. Go to **Project Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 4: Update Your .env File

Replace the values in your `.env` file:

```env
VITE_SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR-ANON-KEY-HERE"

SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
SUPABASE_SERVICE_KEY="YOUR-SERVICE-ROLE-KEY-HERE"
```

**Note**: The service role key is also in Project Settings → API, but keep it secret!

## Step 5: Test Your Setup

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open your app in the browser
3. Try to register a new account
4. If successful, you're all set! 🎉

## Troubleshooting

### Still getting ERR_NAME_NOT_RESOLVED?
- Make sure you updated the `.env` file
- Restart your dev server after changing `.env`
- Clear browser cache

### Can't run SQL?
- Make sure you're in the SQL Editor, not the Table Editor
- Check for any error messages in red

### Authentication not working?
- Verify your anon key is correct
- Check that Email Auth is enabled in Authentication → Providers

## What's Included

Your database now has:
- ✅ User profiles and settings
- ✅ Servers, channels, and members
- ✅ Messages and DMs
- ✅ Friends system
- ✅ Channel invitations
- ✅ Avatar storage
- ✅ Row Level Security (RLS) policies

## Next Steps

Once setup is complete:
1. Create your first user account
2. Create a server
3. Add channels
4. Start chatting!
