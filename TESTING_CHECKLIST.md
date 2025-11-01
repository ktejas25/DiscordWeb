# WebRTC Voice Testing Checklist

## Security & Infrastructure

- [ ] TURN server accessible over TLS (turns://)
- [ ] TURN credentials expire after TTL (5-20 min)
- [ ] rtc_nonce is random and unique per server
- [ ] Only server members can read rtc_nonce (RLS enforced)
- [ ] Presence channel names are unguessable
- [ ] Signaling channel names are unguessable
- [ ] No secrets exposed in client code
- [ ] No PII in presence/signaling messages

## Realtime Presence

- [ ] Users appear under correct voice channels
- [ ] Presence syncs on join
- [ ] Presence updates on leave
- [ ] Presence updates on mute/deafen
- [ ] Speaking indicator updates in real-time
- [ ] Multi-tab: only one presence per user
- [ ] Reconnect: presence restored automatically
- [ ] Ghost users: cleaned up on disconnect

## Signaling

- [ ] Join event broadcasts to all participants
- [ ] Offer/answer exchange works
- [ ] ICE candidates exchange works
- [ ] Leave event removes peer connections
- [ ] Deterministic initiator rule (larger userId offers)
- [ ] No glare (simultaneous offers)
- [ ] Rate limiting prevents spam
- [ ] Messages addressed to correct peer

## WebRTC Mesh

- [ ] Microphone access requested on join
- [ ] Local audio track added to peer connections
- [ ] Remote audio tracks play automatically
- [ ] Peer connections established for all participants
- [ ] ICE candidates gathered and exchanged
- [ ] STUN server used for public IP discovery
- [ ] TURN server used when direct P2P fails
- [ ] Audio quality is acceptable
- [ ] Latency is acceptable (<100ms)

## Mute/Deafen

- [ ] Mute: local track disabled
- [ ] Mute: UI reflects state instantly
- [ ] Mute: other users see muted state
- [ ] Deafen: remote tracks disabled
- [ ] Deafen: auto-mutes microphone
- [ ] Deafen: UI reflects state instantly
- [ ] Unmute: audio resumes
- [ ] Undeafen: remote audio resumes

## Speaking Indicator

- [ ] Local speaking detected via AnalyserNode
- [ ] Speaking state broadcasts to presence
- [ ] Other users see speaking indicator
- [ ] Indicator updates smoothly (250ms polling)
- [ ] No false positives (threshold tuned)
- [ ] Works when muted (local detection)

## UI/UX

- [ ] Voice channels listed in sidebar
- [ ] Join button visible on hover
- [ ] Leave button visible when joined
- [ ] Participants listed under channel
- [ ] Self row shows mic/headphones controls
- [ ] Other rows show mute/deafen state (disabled)
- [ ] Fixed self bar at bottom works everywhere
- [ ] Speaking indicator animates
- [ ] Error messages are user-friendly

## Error Handling

- [ ] Mic permission denied: graceful error
- [ ] No microphone: graceful error
- [ ] TURN server down: fallback or error
- [ ] Network disconnect: reconnect automatically
- [ ] Peer connection failed: retry or error
- [ ] Invalid TURN credentials: error message
- [ ] Supabase Realtime down: error message

## Cross-Browser

- [ ] Chrome: all features work
- [ ] Firefox: all features work
- [ ] Safari: all features work
- [ ] Edge: all features work
- [ ] Mobile Chrome: all features work
- [ ] Mobile Safari: all features work

## Network Conditions

- [ ] Same LAN: direct P2P works
- [ ] Different LANs: TURN relay works
- [ ] Symmetric NAT: TURN relay works
- [ ] Firewall: TURN relay works
- [ ] High latency: audio quality acceptable
- [ ] Packet loss: audio quality acceptable

## Scale Testing

- [ ] 2 users: works perfectly
- [ ] 4 users: works well
- [ ] 6 users: acceptable (mesh limit)
- [ ] 8+ users: performance degrades (expected)
- [ ] Bandwidth usage: ~50-100 kbps per peer
- [ ] CPU usage: acceptable

## Edge Cases

- [ ] Join while already in another channel: leaves first
- [ ] Close tab while in voice: presence cleaned up
- [ ] Refresh page while in voice: rejoins automatically
- [ ] Multiple tabs: only one can join voice
- [ ] Server deleted while in voice: graceful disconnect
- [ ] Channel deleted while in voice: graceful disconnect
- [ ] User kicked while in voice: disconnected

## Definition of Done

- [ ] All security checks pass
- [ ] All presence/signaling checks pass
- [ ] All WebRTC checks pass
- [ ] All UI/UX checks pass
- [ ] All error handling checks pass
- [ ] Works in at least 2 browsers
- [ ] Works across NATs (TURN verified)
- [ ] No ghost users after testing
- [ ] Documentation complete
- [ ] Deployment guide followed
