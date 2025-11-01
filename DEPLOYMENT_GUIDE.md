# WebRTC Voice Deployment Guide

## 1. Deploy TURN Server (coturn)

### Install coturn on Ubuntu/Debian:
```bash
sudo apt update
sudo apt install coturn
```

### Configure `/etc/turnserver.conf`:
```conf
listening-port=3478
tls-listening-port=5349
listening-ip=0.0.0.0
relay-ip=YOUR_SERVER_IP
external-ip=YOUR_SERVER_IP

realm=your-domain.com
server-name=your-domain.com

lt-cred-mech
use-auth-secret
static-auth-secret=YOUR_TURN_SHARED_SECRET

cert=/etc/letsencrypt/live/your-domain.com/fullchain.pem
pkey=/etc/letsencrypt/live/your-domain.com/privkey.pem

no-stdout-log
log-file=/var/log/turnserver.log
```

### Enable and start:
```bash
sudo systemctl enable coturn
sudo systemctl start coturn
```

### Open firewall ports:
```bash
sudo ufw allow 3478/tcp
sudo ufw allow 3478/udp
sudo ufw allow 5349/tcp
sudo ufw allow 5349/udp
sudo ufw allow 49152:65535/udp
```

## 2. Configure Environment Variables

Update `.env`:
```env
TURN_SERVER_URL=turns:your-domain.com:5349
TURN_SHARED_SECRET=YOUR_TURN_SHARED_SECRET
TURN_TTL=1200
```

## 3. Deploy Supabase Edge Function

```bash
supabase functions deploy turn-credentials --no-verify-jwt
```

Set secrets:
```bash
supabase secrets set TURN_SERVER_URL=turns:your-domain.com:5349
supabase secrets set TURN_SHARED_SECRET=YOUR_TURN_SHARED_SECRET
supabase secrets set TURN_TTL=1200
```

## 4. Run Database Migration

```bash
supabase db push
```

Or manually run the SQL in `supabase/migrations/add_rtc_nonce.sql`

## 5. Enable Supabase Realtime

In Supabase Dashboard:
1. Go to Database → Replication
2. Enable replication for `servers` table
3. Go to Settings → API → Realtime
4. Ensure Realtime is enabled

## 6. Test TURN Server

```bash
# Test TURN connectivity
npm install -g turn-tester
turn-tester turns:your-domain.com:5349 YOUR_USERNAME YOUR_PASSWORD
```

## 7. Security Checklist

- [ ] TURN server uses TLS (turns://)
- [ ] TURN shared secret is strong and secret
- [ ] RLS policies enforce server membership
- [ ] rtc_nonce is random per server
- [ ] No PII in presence/signaling
- [ ] Rate limiting on broadcasts
- [ ] CORS configured properly

## 8. Monitoring

Monitor TURN usage:
```bash
tail -f /var/log/turnserver.log
```

Check WebRTC stats in browser console:
```javascript
pc.getStats().then(stats => console.log(stats))
```
