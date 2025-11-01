import { Request, Response } from 'express';
import { AccessToken } from 'livekit-server-sdk';

export async function handleGetVoiceToken(req: Request, res: Response) {
  try {
    const { channelId, userId } = req.body;

    if (!channelId || !userId) {
      return res.status(400).json({ error: 'channelId and userId required' });
    }

    const livekitUrl = process.env.LIVEKIT_URL || 'ws://localhost:7880';
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return res.status(500).json({ error: 'LiveKit credentials not configured' });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: userId,
      ttl: '10h'
    });

    at.addGrant({
      room: channelId,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true
    });

    const token = await at.toJwt();

    res.json({ token, url: livekitUrl });
  } catch (error) {
    console.error('Error generating LiveKit token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
}
