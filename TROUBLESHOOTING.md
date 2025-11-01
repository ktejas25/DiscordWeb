# WebRTC Voice Troubleshooting Guide

## Common Issues

### 1. "Microphone access denied"

**Cause**: Browser blocked microphone permissions

**Solutions**:
- Click the lock icon in address bar → Allow microphone
- Ensure you're using HTTPS (required for getUserMedia)
- Check browser settings → Privacy → Microphone
- Try a different browser

**Debug**:
```javascript
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => console.log('Mic access granted', stream))
  .catch(err => console.error('Mic access denied', err));
```

### 2. "Failed to join voice channel"

**Cause**: TURN server not accessible or credentials invalid

**Solutions**:
- Verify TURN server is running: `systemctl status coturn`
- Check TURN URL in `.env` is correct
- Verify TURN shared secret matches
- Test TURN connectivity: `turn-tester turns:your-domain.com:5349 username password`
- Check firewall allows ports 3478, 5349, 49152-65535

**Debug**:
```javascript
// Check ICE connection state
pc.oniceconnectionstatechange = () => {
  console.log('ICE state:', pc.iceConnectionState);
};
```

### 3. No audio from other users

**Cause**: Remote tracks not playing or deafened

**Solutions**:
- Check you're not deafened (headphones icon red)
- Verify other users are not muted
- Check browser audio settings
- Try toggling deafen off/on
- Refresh the page

**Debug**:
```javascript
// Check remote tracks
pc.getReceivers().forEach(receiver => {
  console.log('Track:', receiver.track.kind, 'Enabled:', receiver.track.enabled);
});
```

### 4. Ghost users (users stuck in channel)

**Cause**: Presence not cleaned up on disconnect

**Solutions**:
- Check Supabase Realtime is enabled
- Verify presence channel subscription
- Ensure `untrack()` is called on leave
- Check browser console for errors
- Manually remove from Supabase dashboard

**Debug**:
```javascript
// Check presence state
const state = channel.presenceState();
console.log('Presence:', state);
```

### 5. Can't connect to peers (ICE failed)

**Cause**: NAT traversal failed, TURN not working

**Solutions**:
- Verify TURN server is accessible from client network
- Check TURN credentials are valid
- Ensure TURN server has correct external IP
- Test with `turn-tester`
- Check browser console for ICE errors

**Debug**:
```javascript
// Monitor ICE candidates
pc.onicecandidate = ({ candidate }) => {
  if (candidate) {
    console.log('ICE candidate:', candidate.type, candidate.address);
  }
};
```

### 6. High latency or choppy audio

**Cause**: Network congestion or too many peers

**Solutions**:
- Limit voice channels to ≤6 users (mesh limitation)
- Check network bandwidth
- Verify TURN server has sufficient bandwidth
- Consider using a media server (SFU) instead of mesh
- Check CPU usage

**Debug**:
```javascript
// Check WebRTC stats
pc.getStats().then(stats => {
  stats.forEach(report => {
    if (report.type === 'inbound-rtp') {
      console.log('Jitter:', report.jitter, 'Packets lost:', report.packetsLost);
    }
  });
});
```

### 7. Speaking indicator not working

**Cause**: AnalyserNode not detecting audio or threshold too high

**Solutions**:
- Check microphone is not muted
- Verify audio input level in browser settings
- Adjust threshold in VoiceClient.ts (currently 20)
- Check AudioContext is created

**Debug**:
```javascript
// Check audio levels
const dataArray = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(dataArray);
const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
console.log('Audio level:', average);
```

### 8. "rtc_nonce is null"

**Cause**: Database migration not run

**Solutions**:
- Run migration: `supabase db push`
- Or manually run SQL in `supabase/migrations/add_rtc_nonce.sql`
- Verify column exists: `SELECT rtc_nonce FROM api.servers LIMIT 1;`

### 9. TURN credentials expired

**Cause**: TTL elapsed (default 20 min)

**Solutions**:
- Rejoin the voice channel to get new credentials
- Increase TTL in `.env` (max 24 hours)
- Implement automatic credential refresh

**Debug**:
```javascript
// Check credential expiry
const [timestamp] = turnUsername.split(':');
const expiresAt = new Date(parseInt(timestamp) * 1000);
console.log('TURN expires:', expiresAt);
```

### 10. Supabase Realtime not working

**Cause**: Realtime not enabled or RLS blocking

**Solutions**:
- Enable Realtime in Supabase Dashboard → Database → Replication
- Check RLS policies allow reading `rtc_nonce`
- Verify Supabase URL and anon key are correct
- Check browser console for Supabase errors

**Debug**:
```javascript
// Test Realtime connection
const channel = supabase.channel('test');
channel.subscribe((status) => {
  console.log('Realtime status:', status);
});
```

## Debug Tools

### Browser Console Commands

```javascript
// Check all peer connections
voiceClient.peers.forEach((pc, peerId) => {
  console.log('Peer:', peerId, 'State:', pc.connectionState);
});

// Check local stream
console.log('Local stream:', voiceClient.localStream);

// Check ICE servers
console.log('ICE servers:', voiceClient.iceServers);

// Force speaking detection
voiceClient.onSpeakingCallback(true);
```

### Network Tools

```bash
# Test TURN server
turn-tester turns:your-domain.com:5349 username password

# Check TURN server logs
tail -f /var/log/turnserver.log

# Test WebRTC connectivity
# Visit: https://test.webrtc.org/

# Check firewall
sudo ufw status
```

### Supabase Tools

```sql
-- Check rtc_nonce
SELECT id, name, rtc_nonce FROM api.servers;

-- Check server members
SELECT * FROM api.server_members WHERE server_id = 'your-server-id';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'servers';
```

## Getting Help

1. Check browser console for errors
2. Check Supabase logs in dashboard
3. Check TURN server logs
4. Test with `turn-tester`
5. Verify all environment variables
6. Review DEPLOYMENT_GUIDE.md
7. Review TESTING_CHECKLIST.md
8. Open an issue with:
   - Browser and version
   - Error messages
   - Network setup (NAT type)
   - Steps to reproduce
