# Getting Started with Voice Channels

## 👋 Welcome!

This guide will help you get voice channels running in 5 minutes, even if you're new to LiveKit or voice chat systems.

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ Node.js 20+ installed
- ✅ Docker Desktop installed and running
- ✅ A code editor (VS Code recommended)
- ✅ Two browsers for testing (Chrome + Edge, or Chrome + Incognito)

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies (Already Done!)

The required packages are already installed:
- `livekit-client` - For voice communication
- `livekit-server-sdk` - For generating access tokens

### Step 2: Start LiveKit Server

LiveKit is the voice server that handles all audio communication.

**Windows:**
```bash
# Double-click this file or run in terminal:
start-voice-dev.bat
```

**Mac/Linux:**
```bash
# Make executable and run:
chmod +x start-voice-dev.sh
./start-voice-dev.sh
```

**What this does:**
- Starts LiveKit server in Docker
- Opens ports 7880 (WebSocket) and 7882 (UDP for audio)
- Uses development credentials (devkey/secret)

**Expected output:**
```
✅ Docker is running
🚀 Starting LiveKit server...
✅ LiveKit server started on ws://localhost:7880
```

### Step 3: Start the Backend

The backend provides:
- LiveKit token generation
- Socket.IO for presence tracking

**Open a new terminal and run:**
```bash
npm run build:server
npm start
```

**Expected output:**
```
Server running on port 8080
Socket.IO ready
```

### Step 4: Start the Frontend

The frontend is your React app with the voice UI.

**Open another new terminal and run:**
```bash
npm run dev
```

**Expected output:**
```
VITE ready in 500ms
Local: http://localhost:5173
```

### Step 5: Test Voice Channels

Now let's test the voice features!

#### 5.1 Open Two Browsers

1. **Browser 1**: Open http://localhost:5173
2. **Browser 2**: Open http://localhost:5173 in Incognito/Private mode

#### 5.2 Login

- **Browser 1**: Login with account A
- **Browser 2**: Login with account B

#### 5.3 Navigate to a Server

Both users should navigate to the same server.

#### 5.4 Join Voice Channel

**In Browser 1:**
1. Look for "Voice Channels" section in sidebar
2. Find a voice channel (has 🔊 icon)
3. Hover over the channel
4. Click the "Join" button that appears
5. **Grant microphone permission** when prompted

**What you should see:**
- Your username appears under the voice channel
- A mic icon and headphones icon appear next to your name
- The footer at the bottom shows your controls

**In Browser 2:**
1. Look at the same voice channel
2. You should see Browser 1's user in the participant list
3. Now click "Join" on Browser 2
4. Grant microphone permission

**What you should see:**
- Both users appear in the participant list
- Both browsers show both users

#### 5.5 Test Mic Toggle

**In Browser 1:**
1. Click the mic icon next to your name
2. Icon should turn red (muted)
3. Check Browser 2 - your mic icon should be red there too

**In Browser 2:**
1. Verify Browser 1's mic icon is red
2. Click your own mic icon
3. Both browsers should update

#### 5.6 Test Speaking Indicator

**In Browser 1:**
1. Unmute your mic (click mic icon if red)
2. Speak into your microphone
3. You should see a **green ring** appear around your avatar
4. Check Browser 2 - they should see the green ring too

**In Browser 2:**
1. Watch Browser 1's avatar
2. When they speak, green ring appears
3. When they stop, ring disappears

#### 5.7 Test Deafen (Headphones)

**In Browser 1:**
1. Click the headphones icon
2. Icon turns red
3. Mic also auto-mutes (turns red)
4. You can no longer hear Browser 2

**To undeafen:**
1. Click headphones icon again
2. Icon returns to normal
3. Mic stays muted (you need to unmute separately)

#### 5.8 Test Leave

**In Browser 1:**
1. Hover over the voice channel header
2. Click "Leave" button
3. You disappear from the participant list
4. Check Browser 2 - you should be gone there too

## 🎉 Success!

If all the above worked, congratulations! Your voice channels are working perfectly.

## 🎨 UI Guide

### Sidebar Layout

```
┌─────────────────────────┐
│ Server Channels    [+]  │
├─────────────────────────┤
│ TEXT CHANNELS           │
│ # general               │
│ # announcements         │
│                         │
│ VOICE CHANNELS          │
│ 🔊 General Voice [Join] │
│   👤 Alice 🎤 🎧       │
│   👤 Bob   🎤 🎧       │
│                         │
│ 🔊 Music Room           │
│   (empty)               │
│                         │
│ (scrollable area)       │
│                         │
├─────────────────────────┤
│ 👤 You                  │
│    Online               │
│    🎤 🎧 ⚙️            │
└─────────────────────────┘
```

### Icon Guide

| Icon | Meaning |
|------|---------|
| 🔊 | Voice channel |
| 🎤 | Mic (gray = unmuted) |
| 🎤❌ | Mic (red = muted) |
| 🎧 | Headphones (gray = normal) |
| 🎧❌ | Headphones (red = deafened) |
| 🟢 | Green ring = speaking |
| ⚙️ | Settings (placeholder) |

### Controls

**Mic Button:**
- Click to mute/unmute your microphone
- Red = muted (others can't hear you)
- Gray = unmuted (others can hear you)

**Headphones Button:**
- Click to deafen/undeafen
- Red = deafened (you can't hear others)
- Gray = normal (you can hear others)
- Auto-mutes mic when deafened

**Join/Leave Button:**
- Appears on hover over voice channel
- Click to join or leave the channel

## 🐛 Troubleshooting

### "Docker is not running"

**Problem:** Docker Desktop is not started

**Solution:**
1. Open Docker Desktop
2. Wait for it to fully start
3. Run start-voice-dev.bat again

### "Permission denied" for microphone

**Problem:** Browser blocked microphone access

**Solution:**
1. Click the 🔒 icon in browser address bar
2. Find "Microphone" permission
3. Change to "Allow"
4. Refresh the page
5. Try joining again

### "Can't hear audio"

**Problem:** You might be deafened

**Solution:**
1. Check if headphones icon is red
2. If red, click it to undeafen
3. Check your computer's audio output
4. Make sure volume is up

### "I see myself twice" or "Ghost users"

**Problem:** Stale presence data

**Solution:**
1. Wait 30 seconds - auto-cleanup will remove ghosts
2. If persists, refresh both browsers
3. Rejoin the voice channel

### "No green ring when speaking"

**Problem:** Mic input level too low or muted

**Solution:**
1. Check if mic is muted (red icon)
2. Unmute by clicking mic icon
3. Check computer's mic input level
4. Speak louder or closer to mic
5. Try a different browser

### "Port 7880 already in use"

**Problem:** LiveKit already running or port taken

**Solution:**
```bash
# Stop existing LiveKit
docker stop livekit-dev

# Start again
start-voice-dev.bat
```

## 📚 Next Steps

Now that voice channels are working, you can:

1. **Read the docs:**
   - `VOICE_README.md` - Complete overview
   - `VOICE_ARCHITECTURE.md` - How it works

2. **Customize:**
   - Modify UI in `client/components/`
   - Adjust settings in `.env`
   - Add features to `useVoice.ts`

3. **Deploy to production:**
   - See `VOICE_SETUP.md` for production deployment
   - Sign up for LiveKit Cloud
   - Configure HTTPS/WSS

## 💡 Tips

- **Use headphones** when testing to avoid echo
- **Chrome works best** for WebRTC features
- **Grant permissions** when browser asks
- **Check console** (F12) if something breaks
- **Test with 2+ users** to see real-time updates

## 🆘 Still Having Issues?

1. Check browser console (F12) for errors
2. Verify all three services are running:
   - LiveKit (Docker)
   - Backend (npm start)
   - Frontend (npm run dev)
3. Check `VOICE_TESTING.md` for detailed test scenarios
4. Review `VOICE_TROUBLESHOOTING.md` for common issues

## 🎊 You're All Set!

You now have a working Discord-like voice channel system. Enjoy building!

---

**Quick Commands Reference:**

```bash
# Start LiveKit
start-voice-dev.bat

# Start Backend
npm run build:server && npm start

# Start Frontend
npm run dev

# Stop LiveKit
docker stop livekit-dev
```

**Test URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- LiveKit: ws://localhost:7880
