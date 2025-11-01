# Voice Channel Setup Guide

## Overview

This implementation provides Discord-like voice channels with:
- LiveKit for real-time voice communication (SFU architecture)
- Socket.IO for presence management across channels
- Mic/headphones controls with speaking indicators
- Cross-channel participant visibility

## Prerequisites

- Node.js 20+
- LiveKit server (for production) or Docker (for development)

## Environment Variables

Add these to your `.env` file:

```env
# LiveKit Configuration
VITE_LIVEKIT_URL="ws://localhost:7880"
LIVEKIT_URL="ws://localhost:7880"
LIVEKIT_API_KEY="devkey"
LIVEKIT_API_SECRET="secret"

# Socket.IO (already configured)
VITE_SOCKET_URL="http://localhost:8080"
```

## Development Setup

### Option 1: Docker (Recommended for Development)

Run LiveKit server with Docker:

```bash
docker run --rm -p 7880:7880 -p 7881:7881 -p 7882:7882/udp \
  -e LIVEKIT_KEYS="devkey: secret" \
  livekit/livekit-server --dev
```

### Option 2: Download LiveKit Binary

1. Download from https://github.com/livekit/livekit/releases
2. Create `livekit.yaml`:

```yaml
port: 7880
rtc:
  port_range_start: 7882
  port_range_end: 7882
  use_external_ip: false
keys:
  devkey: secret
```

3. Run: `./livekit-server --config livekit.yaml --dev`

## Running the Application

### Terminal 1: Start LiveKit (if using Docker)
```bash
docker run --rm -p 7880:7880 -p 7881:7881 -p 7882:7882/udp \
  -e LIVEKIT_KEYS="devkey: secret" \
  livekit/livekit-server --dev
```

### Terminal 2: Start Backend (Socket.IO + API)
```bash
npm run build:server
npm start
```

### Terminal 3: Start Frontend
```bash
npm run dev
```

## Testing

1. Open two browser windows (Chrome/Edge recommended)
2. Login with different accounts in each window
3. Navigate to a server with voice channels
4. Click the join button on a voice channel
5. Grant microphone permissions
6. Test features:
   - Mic toggle (mute/unmute)
   - Headphones toggle (deafen/undeafen)
   - Speaking indicator (green ring around avatar)
   - Participant list updates in real-time
   - Leave/rejoin functionality

## Production Setup

### LiveKit Cloud (Recommended)

1. Sign up at https://cloud.livekit.io
2. Create a project and get credentials
3. Update `.env`:

```env
VITE_LIVEKIT_URL="wss://your-project.livekit.cloud"
LIVEKIT_URL="wss://your-project.livekit.cloud"
LIVEKIT_API_KEY="your-api-key"
LIVEKIT_API_SECRET="your-api-secret"
```

### Self-Hosted LiveKit

1. Deploy LiveKit server on your infrastructure
2. Configure TURN/STUN servers for NAT traversal
3. Use HTTPS/WSS for secure connections
4. Update environment variables accordingly

### TURN Configuration

For production, configure TURN servers in LiveKit config:

```yaml
rtc:
  turn_servers:
    - host: turn.example.com
      port: 3478
      protocol: udp
      username: user
      credential: pass
```

Or use LiveKit Cloud's built-in TURN servers.

For development, Google STUN is sufficient:
- `stun:stun.l.google.com:19302`

## Architecture

### Client-Side
- **VoiceClient.ts**: LiveKit room management, audio tracks, speaking detection
- **PresenceClient.ts**: Socket.IO presence synchronization
- **useVoice.ts**: React hook for voice state management
- **VoiceChannelItem.tsx**: Voice channel UI with participant list
- **ParticipantRow.tsx**: Individual participant with controls
- **SelfFooter.tsx**: Fixed footer with self controls

### Server-Side
- **routes/voice.ts**: LiveKit token generation endpoint
- **sockets/handlers.ts**: Voice presence events (join/leave/state/speaking)
- In-memory presence store with TTL and heartbeat cleanup

### Data Flow

1. **Join Voice Channel**:
   - Client requests token from `/api/voice/token`
   - Client connects to LiveKit room
   - Client emits `voice:join` to Socket.IO
   - Server broadcasts presence to all clients

2. **Mic/Headphones Toggle**:
   - Client updates local LiveKit state
   - Client emits `voice:state` to Socket.IO
   - Server broadcasts to all clients
   - UI updates for all users

3. **Speaking Detection**:
   - LiveKit detects audio levels
   - Client throttles and emits `voice:speaking`
   - Server broadcasts to all clients
   - Green ring appears around avatar

4. **Presence Sync**:
   - Heartbeat every 15s keeps user alive
   - Server cleanup removes stale users (30s timeout)
   - Prevents ghost users on refresh/disconnect

## Troubleshooting

### Microphone Permission Denied
- Ensure HTTPS in production (required for getUserMedia)
- Check browser permissions
- Try different browser

### No Audio
- Check if deafened (headphones button red)
- Verify LiveKit server is running
- Check browser console for errors
- Ensure audio playback is enabled

### Ghost Users
- Heartbeat mechanism should prevent this
- Check server logs for cleanup intervals
- Verify Socket.IO connection is stable

### Connection Issues
- Verify LiveKit URL is correct
- Check firewall allows UDP ports (7882)
- Ensure TURN is configured for production
- Test with `localhost` first

## Browser Compatibility

- Chrome/Edge: Full support ✅
- Firefox: Full support ✅
- Safari: Requires HTTPS for getUserMedia ⚠️
- Mobile: Supported but test thoroughly 📱

## Security Considerations

- LiveKit tokens expire after 10 hours (configurable)
- Tokens are scoped to specific rooms
- Use HTTPS/WSS in production
- Validate user permissions before issuing tokens
- Consider rate limiting token endpoint

## Performance

- LiveKit uses SFU (Selective Forwarding Unit) for efficient bandwidth
- Speaking updates throttled to 250ms
- Presence heartbeat every 15s
- Cleanup runs every 15s
- Scales to 100+ participants per room

## Future Enhancements

- Video support
- Screen sharing
- Push-to-talk
- Voice activity detection sensitivity
- Admin controls (mute others, kick)
- Recording functionality
- Spatial audio
