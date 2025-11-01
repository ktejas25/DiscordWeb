# Voice Channels - Quick Reference

## 🚀 Start Development (3 Commands)

```bash
# Terminal 1: LiveKit
start-voice-dev.bat

# Terminal 2: Backend
npm run build:server && npm start

# Terminal 3: Frontend
npm run dev
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `client/hooks/useVoice.ts` | Main voice state hook |
| `client/services/VoiceClient.ts` | LiveKit wrapper |
| `client/services/PresenceClient.ts` | Socket.IO presence |
| `server/routes/voice.ts` | Token generation |
| `server/sockets/handlers.ts` | Presence events |

## 🎛️ API Reference

### useVoice Hook

```typescript
const {
  voiceState,        // All channel states
  currentChannelId,  // Current channel
  selfMuted,         // Mic state
  selfDeafened,      // Deafen state
  joinVoice,         // Join channel
  leaveVoice,        // Leave channel
  toggleMute,        // Toggle mic
  toggleDeafen       // Toggle deafen
} = useVoice();
```

### Socket.IO Events

**Emit:**
- `voice:join` - Join channel
- `voice:leave` - Leave channel
- `voice:state` - Update state
- `voice:speaking` - Speaking update
- `voice:heartbeat` - Keep-alive

**Listen:**
- `voice:userlist` - Full list
- `voice:join` - User joined
- `voice:leave` - User left
- `voice:state` - State changed
- `voice:speaking` - Speaking changed

## 🔧 Environment Variables

```env
VITE_LIVEKIT_URL="ws://localhost:7880"
LIVEKIT_URL="ws://localhost:7880"
LIVEKIT_API_KEY="devkey"
LIVEKIT_API_SECRET="secret"
VITE_SOCKET_URL="http://localhost:8080"
```

## 🎨 Components

```
ChannelsList
  └── VoiceChannelItem
      └── ParticipantRow
  └── SelfFooter
```

## 🐛 Debug Commands

```javascript
// Browser console
window.voiceClient?.isConnected()
window.socketService?.getSocket()?.connected
```

## 📊 Performance Targets

- Join: < 2s
- Speaking: < 300ms
- Presence: < 200ms
- Heartbeat: 15s
- Cleanup: 30s

## 🔐 Production Checklist

- [ ] LiveKit Cloud or self-hosted
- [ ] HTTPS/WSS enabled
- [ ] TURN servers configured
- [ ] Permission checks added
- [ ] Rate limiting enabled
- [ ] Environment variables secured

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| No audio | Check deafened state |
| Can't join | Verify LiveKit running |
| Ghost users | Wait 30s for cleanup |
| Token error | Check .env credentials |

## 📚 Documentation

- `VOICE_README.md` - Overview
- `VOICE_SETUP.md` - Setup guide
- `VOICE_TESTING.md` - Test scenarios
- `VOICE_ARCHITECTURE.md` - System design

## 🎯 Test Checklist

- [ ] Join/leave
- [ ] Mic toggle
- [ ] Headphones toggle
- [ ] Speaking indicator
- [ ] Multi-user
- [ ] Refresh (no ghosts)

## 💡 Quick Tips

- Use Chrome for best compatibility
- Grant mic permissions when prompted
- Test with headphones to avoid echo
- Check browser console for errors
- Use two browsers for multi-user testing

## 🔗 Links

- LiveKit Docs: https://docs.livekit.io
- Socket.IO Docs: https://socket.io/docs
- LiveKit Cloud: https://cloud.livekit.io
