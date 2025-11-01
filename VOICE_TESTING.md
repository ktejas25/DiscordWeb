# Voice Channel Testing Guide

## Quick Start

### 1. Start LiveKit Server (Windows)
```bash
start-voice-dev.bat
```

Or manually:
```bash
docker run --rm -d --name livekit-dev -p 7880:7880 -p 7881:7881 -p 7882:7882/udp -e LIVEKIT_KEYS="devkey: secret" livekit/livekit-server --dev
```

### 2. Start Backend
```bash
npm run build:server
npm start
```

### 3. Start Frontend
```bash
npm run dev
```

## Test Scenarios

### Basic Join/Leave
1. Open browser at http://localhost:5173
2. Login with test account
3. Navigate to a server
4. Click join button on a voice channel
5. Grant microphone permission
6. Verify you appear in participant list
7. Click leave button
8. Verify you're removed from list

### Mic Toggle
1. Join a voice channel
2. Click mic button in participant row
3. Verify icon changes to red MicOff
4. Click again to unmute
5. Verify icon returns to normal

### Deafen Toggle
1. Join a voice channel
2. Click headphones button
3. Verify:
   - Icon turns red (HeadphonesOff)
   - Mic also auto-mutes
   - You can't hear others
4. Click again to undeafen

### Speaking Indicator
1. Join voice channel with another user
2. Speak into microphone
3. Verify green ring appears around your avatar
4. Stop speaking
5. Ring should disappear

### Cross-Channel Visibility
1. User A joins voice channel 1
2. User B stays in text channel
3. User B should see User A in voice channel 1 participant list
4. User B doesn't need to join to see participants

### Self Footer
1. Join any voice channel
2. Scroll channels list
3. Verify footer with your controls stays visible at bottom
4. Controls should work from footer

### Multi-User Test
1. Open two browser windows (or incognito)
2. Login with different accounts
3. Both join same voice channel
4. Test:
   - Both see each other in list
   - Mic toggles update for both users
   - Speaking indicators work
   - Leave updates both UIs

### Reconnection Test
1. Join voice channel
2. Refresh page
3. Verify:
   - You're removed from participant list
   - No ghost user remains
   - Can rejoin successfully

### Permission Denied
1. Join voice channel
2. Deny microphone permission
3. Verify error toast appears
4. Grant permission in browser settings
5. Try joining again

## Expected Behavior

### Mic Button
- **Unmuted**: Gray mic icon
- **Muted**: Red mic-off icon
- **Self only**: Clickable
- **Others**: Display only

### Headphones Button
- **Normal**: Gray headphones icon
- **Deafened**: Red headphones-off icon
- **Auto-mutes mic** when deafened
- **Self only**: Clickable

### Speaking Indicator
- **Speaking**: Green ring with pulse animation
- **Silent**: No ring
- **Updates**: 250ms throttle
- **Visible to all** participants

### Participant List
- Shows under voice channel
- Updates in real-time
- Visible even if not joined
- Sorted by join order

### Self Footer
- Always visible at bottom
- Shows current user
- Mic/headphones controls
- Settings button (placeholder)

## Common Issues

### No audio
- Check if deafened (red headphones)
- Verify LiveKit server running
- Check browser console for errors

### Can't join
- Verify token endpoint responding
- Check LiveKit URL in .env
- Ensure mic permission granted

### Ghost users
- Should auto-cleanup after 30s
- Check heartbeat in network tab
- Verify Socket.IO connected

### Speaking not detected
- Check mic input level in OS
- Verify mic not muted in OS
- Try different browser

## Browser Console Commands

Check voice state:
```javascript
// In browser console
window.voiceState
```

Check LiveKit connection:
```javascript
window.voiceClient?.isConnected()
```

Check Socket.IO:
```javascript
window.socketService?.getSocket()?.connected
```

## Performance Metrics

- **Join time**: < 2 seconds
- **Speaking latency**: < 250ms
- **Presence update**: < 100ms
- **Heartbeat interval**: 15s
- **Cleanup interval**: 15s
- **User timeout**: 30s

## Stop Services

```bash
# Stop LiveKit
docker stop livekit-dev

# Stop backend (Ctrl+C in terminal)

# Stop frontend (Ctrl+C in terminal)
```
