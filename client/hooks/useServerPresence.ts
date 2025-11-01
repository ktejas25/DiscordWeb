import { useState, useEffect, useMemo } from 'react';
import { presenceManager, PresenceMeta } from '@/services/PresenceManager';
import { useAuth } from '@/contexts/AuthContext';

export function useServerPresence(serverId: string | null) {
  const { user } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!serverId || !user) return;

    const nonce = 'default';
    presenceManager.subscribe(serverId, nonce, user.id, user.username, user.avatar_url);

    const unsubscribe = presenceManager.onChange(() => {
      setTick(t => t + 1);
    });

    return () => {
      unsubscribe();
      presenceManager.unsubscribe();
    };
  }, [serverId, user]);

  const grouped = useMemo(() => presenceManager.getGroupedPresence(), [serverId, user]);

  return {
    textByChannel: grouped.textByChannel,
    voiceByChannel: grouped.voiceByChannel,
    setActiveText: (channelId: string | null) => presenceManager.setActiveText(channelId),
    joinVoice: (channelId: string) => presenceManager.joinVoice(channelId),
    leaveVoice: () => presenceManager.leaveVoice(),
  };
}
