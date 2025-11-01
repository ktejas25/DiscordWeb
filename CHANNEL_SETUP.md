# Channel Invitations Setup Guide

## Quick Start

### 1. Run Database Migration
```bash
# Apply the migration to create tables
supabase db push
```

Or manually run the migration file:
```bash
supabase db execute -f supabase/migrations/008_channel_invitations_and_members.sql
```

### 2. Install Dependencies (if needed)
All dependencies should already be installed. If not:
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test the Feature

#### Create a Channel
1. Select a server from the left sidebar
2. Click the "+" button in the channels list
3. Enter channel name and select "Text" type
4. Click "Create Channel"

#### Invite Members
1. Open the channel you created
2. Click the "Invite" button in the header
3. Search for a user by username
4. Click the invite button next to their name

#### Accept Invitation (as another user)
1. Log in as the invited user
2. See the pending invitation banner at the top
3. Click the checkmark to accept
4. You'll be added to the channel

#### Chat in Channel
1. Type a message in the input field
2. Press Enter or click Send
3. Messages appear in real-time for all members
4. See typing indicators when others are typing

## Environment Variables

Ensure these are set in your `.env` file:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
SUPABASE_ANON_KEY=your_anon_key
VITE_SOCKET_URL=http://localhost:8081
```

## Troubleshooting

### Invitations not appearing
- Check that WebSocket connection is established
- Verify user IDs match in database
- Check browser console for errors

### Messages not sending
- Ensure channel_id is set correctly
- Verify user is authenticated
- Check socket connection status

### Members list empty
- Run the migration to create channel_members table
- Verify RLS policies are set correctly
- Check that users accepted invitations

## Architecture

```
Client                    Server                  Database
  |                         |                         |
  |-- Send Invitation ----->|                         |
  |                         |-- Insert ------------->|
  |                         |<-- Success ------------|
  |<-- Socket Event --------|                         |
  |                         |                         |
  |-- Accept Invitation --->|                         |
  |                         |-- Update Status ------>|
  |                         |-- Add Member --------->|
  |<-- Success -------------|                         |
  |                         |                         |
  |-- Send Message -------->|                         |
  |                         |-- Insert ------------->|
  |<-- Socket Broadcast ----|                         |
```

## Next Steps

- Add file/image sharing in channels
- Implement message reactions
- Add message threading/replies
- Create channel categories
- Add channel permissions system
- Implement voice channels integration
