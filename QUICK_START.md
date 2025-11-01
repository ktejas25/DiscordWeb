# Quick Start - WebRTC Voice

## Prerequisites
- Node.js 18+
- Supabase account
- TURN server (coturn) - see DEPLOYMENT_GUIDE.md

## 1. Environment Setup

Copy `.env` and update these values:
```env
# Your TURN server details
TURN_SERVER_URL=turns:your-turn-server.com:5349
TURN_SHARED_SECRET=your-secret-here
TURN_TTL=1200
```

## 2. Database Migration

Run the migration to add `rtc_nonce` to servers:
```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in supabase/migrations/add_rtc_nonce.sql
```

## 3. Deploy Edge Function

```bash
# Deploy TURN credentials function
supabase functions deploy turn-credentials

# Set secrets
supabase secrets set TURN_SERVER_URL=turns:your-domain.com:5349
supabase secrets set TURN_SHARED_SECRET=your-secret
supabase secrets set TURN_TTL=1200
```

## 4. Install Dependencies

```bash
npm install
```

## 5. Start Development

```bash
npm run dev
```

## 6. Test Voice

1. Create a server
2. Create a voice channel
3. Click "Join" in the sidebar
4. Allow microphone access
5. Toggle mic/headphones to test

## Troubleshooting

### "Microphone access denied"
- Check browser permissions
- Ensure HTTPS (required for getUserMedia)

### "Failed to join voice channel"
- Check TURN server is running
- Verify TURN credentials are correct
- Check browser console for WebRTC errors

### No audio
- Check mic/headphone states
- Verify TURN server is accessible
- Test with `turn-tester` (see DEPLOYMENT_GUIDE.md)

### Ghost users
- Check Supabase Realtime is enabled
- Verify presence channel subscriptions
- Check browser console for errors

## Architecture

```
User → Supabase Realtime (Presence) → Other Users
  ↓
WebRTC Mesh (P2P Audio)
  ↓
TURN Server (NAT Traversal)
```

## Next Steps

- Deploy TURN server for production (DEPLOYMENT_GUIDE.md)
- Configure rate limiting
- Add speaking indicators
- Implement moderator controls
- Add voice channel permissions
