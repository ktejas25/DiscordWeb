import { useState, useEffect, useCallback } from 'react';
import { VoiceState } from '@/types/voice';
import { voiceClient } from '@/services/VoiceClient';
import { presenceClient } from '@/services/PresenceClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useVoice() {
  const { user } = useAuth();
  const [voiceState, setVoiceState] = useState<VoiceState>({});
  const [currentChannelId, setCurrentChannelId] = useState<string | null>(null);
  const [selfMuted, setSelfMuted] = useState(false);
  const [selfDeafened, setSelfDeafened] = useState(false);

  useEffect(() => {
    try {
      presenceClient.subscribe();
    } catch (error) {
      console.warn('Voice presence unavailable:', error);
      return;
    }

    const handleUserList = (e: Event) => {
      const { channelId, participants } = (e as CustomEvent).detail;
      setVoiceState(prev => ({
        ...prev,
        [channelId]: {
          isJoinedBySelf: prev[channelId]?.isJoinedBySelf || false,
          participants
        }
      }));
    };

    const handleUserJoin = (e: Event) => {
      const { channelId, user: joinedUser } = (e as CustomEvent).detail;
      setVoiceState(prev => ({
        ...prev,
        [channelId]: {
          isJoinedBySelf: prev[channelId]?.isJoinedBySelf || false,
          participants: [...(prev[channelId]?.participants || []), joinedUser]
        }
      }));
    };

    const handleUserLeave = (e: Event) => {
      const { channelId, userId } = (e as CustomEvent).detail;
      setVoiceState(prev => ({
        ...prev,
        [channelId]: {
          isJoinedBySelf: prev[channelId]?.isJoinedBySelf || false,
          participants: (prev[channelId]?.participants || []).filter(p => p.userId !== userId)
        }
      }));
    };

    const handleStateUpdate = (e: Event) => {
      const { channelId, userId, muted, deafened } = (e as CustomEvent).detail;
      setVoiceState(prev => ({
        ...prev,
        [channelId]: {
          ...prev[channelId],
          participants: (prev[channelId]?.participants || []).map(p =>
            p.userId === userId ? { ...p, muted, deafened } : p
          )
        }
      }));
    };

    const handleSpeaking = (e: Event) => {
      const { channelId, userId, speaking } = (e as CustomEvent).detail;
      setVoiceState(prev => ({
        ...prev,
        [channelId]: {
          ...prev[channelId],
          participants: (prev[channelId]?.participants || []).map(p =>
            p.userId === userId ? { ...p, speaking } : p
          )
        }
      }));
    };

    window.addEventListener('voice:userlist', handleUserList);
    window.addEventListener('voice:join', handleUserJoin);
    window.addEventListener('voice:leave', handleUserLeave);
    window.addEventListener('voice:state', handleStateUpdate);
    window.addEventListener('voice:speaking', handleSpeaking);

    return () => {
      try {
        window.removeEventListener('voice:userlist', handleUserList);
        window.removeEventListener('voice:join', handleUserJoin);
        window.removeEventListener('voice:leave', handleUserLeave);
        window.removeEventListener('voice:state', handleStateUpdate);
        window.removeEventListener('voice:speaking', handleSpeaking);
        presenceClient.unsubscribe();
      } catch (error) {
        console.warn('Cleanup error:', error);
      }
    };
  }, []);

  const joinVoice = useCallback(async (channelId: string) => {
    if (!user) return;

    try {
      const response = await fetch('http://localhost:8081/api/voice/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, userId: user.id })
      });

      if (!response.ok) throw new Error('Failed to get token');

      const { token } = await response.json();
      await voiceClient.connect(channelId, token);
      await voiceClient.setMicMuted(selfMuted);

      presenceClient.joinVoice(channelId, {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatar_url
      });

      setCurrentChannelId(channelId);
      setVoiceState(prev => ({
        ...prev,
        [channelId]: {
          isJoinedBySelf: true,
          participants: prev[channelId]?.participants || []
        }
      }));

      voiceClient.onSpeaking((userId, speaking) => {
        presenceClient.updateSpeaking(channelId, userId, speaking);
      });

      toast.success('Joined voice channel');
    } catch (error) {
      console.error('Failed to join voice:', error);
      toast.error('Failed to join voice channel');
    }
  }, [user, selfMuted]);

  const leaveVoice = useCallback(async () => {
    if (!currentChannelId || !user) return;

    await voiceClient.leave();
    presenceClient.leaveVoice(currentChannelId, user.id);

    setVoiceState(prev => ({
      ...prev,
      [currentChannelId]: {
        isJoinedBySelf: false,
        participants: prev[currentChannelId]?.participants || []
      }
    }));

    setCurrentChannelId(null);
    toast.success('Left voice channel');
  }, [currentChannelId, user]);

  const toggleMute = useCallback(async () => {
    if (!currentChannelId || !user) return;

    const newMuted = !selfMuted;
    setSelfMuted(newMuted);
    await voiceClient.setMicMuted(newMuted);
    presenceClient.updateState(currentChannelId, user.id, newMuted, selfDeafened);
  }, [currentChannelId, user, selfMuted, selfDeafened]);

  const toggleDeafen = useCallback(async () => {
    if (!currentChannelId || !user) return;

    const newDeafened = !selfDeafened;
    setSelfDeafened(newDeafened);
    voiceClient.setDeafened(newDeafened);

    if (newDeafened && !selfMuted) {
      setSelfMuted(true);
      await voiceClient.setMicMuted(true);
    }

    presenceClient.updateState(currentChannelId, user.id, newDeafened ? true : selfMuted, newDeafened);
  }, [currentChannelId, user, selfMuted, selfDeafened]);

  return {
    voiceState,
    currentChannelId,
    selfMuted,
    selfDeafened,
    joinVoice,
    leaveVoice,
    toggleMute,
    toggleDeafen
  };
}
