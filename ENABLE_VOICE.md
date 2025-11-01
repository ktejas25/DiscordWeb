# Enable Voice Chat

Voice features are currently disabled to prevent errors. Follow these steps to enable them:

## Step 1: Start LiveKit Server

```bash
docker run --rm -d --name livekit-dev -p 7880:7880 -p 7881:7881 -p 7882:7882/udp -e LIVEKIT_KEYS="devkey: secret" livekit/livekit-server --dev
```

## Step 2: Verify Backend is Running

Make sure your backend server is running with the voice routes:
```bash
npm run build:server
npm start
```

## Step 3: Test Backend Endpoints

Open browser and check:
- http://localhost:8080/ping (should return "ping pong")

## Step 4: Enable Voice UI

Once LiveKit and backend are running, uncomment the voice features in `ChannelsList.tsx`:

1. Add imports:
```typescript
import { useVoice } from '@/hooks/useVoice';
import { VoiceChannelItem } from './VoiceChannelItem';
import { SelfFooter } from './SelfFooter';
import { useAuth } from '@/contexts/AuthContext';
```

2. Add voice hook:
```typescript
const { user } = useAuth();
const { voiceState, currentChannelId, selfMuted, selfDeafened, joinVoice, leaveVoice, toggleMute, toggleDeafen } = useVoice();
```

3. Replace voice channel rendering with VoiceChannelItem component

## Current Status

Voice features are **DISABLED** to prevent white screen errors.

All voice code is ready but requires:
- ✅ LiveKit server running
- ✅ Backend with voice routes
- ❌ Voice UI enabled in ChannelsList.tsx

## Quick Test

If you just want to see if it works without full setup, the voice channels will show in the sidebar with 🔊 icon, but clicking them won't do anything until you complete the setup above.
