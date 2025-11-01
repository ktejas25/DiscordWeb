# WebRTC Voice Implementation Summary

## Architecture Overview

This implementation replaces LiveKit with a **WebRTC mesh architecture** using Supabase Realtime for presence and signaling.

## Key Components

### 1. Security & Infrastructure
- **TURN Server**: coturn with TLS (turns://) and shared secret REST auth
- **TURN Credentials**: Supabase Edge Function mints short-lived credentials (5-20 min TTL)
- **Unguessable Channels**: `rtc_nonce` per server ensures only members can derive channel names
- **RLS Policies**: Enforce server membership for reading `rtc_nonce`

### 2. Realtime Presence
- **Channel**: `voice-presence:<serverId>:<rtc_nonce>`
- **Metadata**: `activeVoiceChannelId`, `muted`, `deafened`, `speaking`, user identity
- **Updates**: Automatic sync on join/leave/state changes
- **UI**: Users grouped by channel in sidebar

### 3. Signaling (Supabase Realtime Broadcast)
- **Channel**: `rtc:<serverId>:<rtc_nonce>:<voiceChannelId>`
- **Events**: `rtc:join`, `rtc:offer`, `rtc:answer`, `rtc:ice`, `rtc:leave`
- **Initiator Rule**: Larger userId creates offer (prevents glare)
- **Rate Limiting**: Built into Supabase Realtime

### 4. WebRTC Mesh
- **Connection**: Peer-to-peer audio only
- **ICE Servers**: Google STUN + your TURN server
- **Mute**: `localTrack.enabled = false`
- **Deafen**: Disable remote audio tracks
- **Speaking Detection**: AnalyserNode on local stream (250ms polling)

### 5. Channels + UI
- **Postgres Changes**: Real-time channel updates via Supabase subscriptions
- **Sidebar**: Shows users under each text/voice channel
- **Self Controls**: Mic/headphones in voice channel + fixed bottom bar
- **Visual Feedback**: Speaking indicator, mute/deafen states

## Error Handling
- Mic permission denied → graceful error message
- No device → fallback UI
- Reconnects → automatic via Supabase Realtime
- Multi-tab → dedupe via presence tracking
- TURN fallback → automatic via WebRTC

## Files Modified/Created

### Created:
- `supabase/migrations/add_rtc_nonce.sql` - Database schema
- `supabase/functions/turn-credentials/index.ts` - TURN credential minting
- `client/services/SignalingClient.ts` - WebRTC signaling
- `DEPLOYMENT_GUIDE.md` - Infrastructure setup
- `VOICE_IMPLEMENTATION.md` - This file

### Modified:
- `.env` - Added TURN configuration
- `client/services/PresenceClient.ts` - Replaced Socket.io with Supabase Realtime
- `client/services/VoiceClient.ts` - Replaced LiveKit with WebRTC mesh
- `client/hooks/useVoice.ts` - Updated to use new architecture

## Usage

```typescript
// In your component
const { voiceState, joinVoice, leaveVoice, toggleMute, toggleDeafen } = useVoice(serverId);

// Join voice channel
await joinVoice(channelId);

// Toggle mic
await toggleMute();

// Toggle headphones
await toggleDeafen();

// Leave
await leaveVoice();
```

## Testing Checklist
- [ ] Users appear under correct channels in real-time
- [ ] Mic/headphone states sync instantly
- [ ] Audio works in voice channels
- [ ] Fixed self bar works everywhere
- [ ] Calls succeed across NATs (TURN working)
- [ ] No ghost users after disconnects
- [ ] Channel names are unguessable
- [ ] Only server members can join voice

## Performance
- **Recommended**: ≤6 users per voice channel (mesh scales O(n²))
- **Bandwidth**: ~50-100 kbps per peer connection
- **Latency**: <100ms with TURN, <50ms with direct P2P

## Next Steps
1. Deploy TURN server (see DEPLOYMENT_GUIDE.md)
2. Run database migration
3. Deploy Supabase Edge Function
4. Update environment variables
5. Test across different networks
