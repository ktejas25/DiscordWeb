import { useState, useEffect } from 'react';
import { channelService } from '@/services/channelService';
import { Channel } from '@shared/api';

export function useChannels(serverId: string | null) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serverId) {
      setChannels([]);
      setIsLoading(false);
      return;
    }

    const fetchChannels = async () => {
      try {
        setIsLoading(true);
        const data = await channelService.getServerChannels(serverId);
        setChannels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch channels');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, [serverId]);

  const createChannel = async (name: string, type: 'text' | 'voice' = 'text', is_private: boolean = false) => {
    if (!serverId) throw new Error('No server selected');
    try {
      const newChannel = await channelService.createChannel(serverId, name, type, is_private);
      setChannels([...channels, newChannel]);
      return newChannel;
    } catch (err) {
      throw err;
    }
  };

  const updateChannel = async (channelId: string, updates: Partial<Channel>) => {
    try {
      const updated = await channelService.updateChannel(channelId, updates);
      setChannels(channels.map(c => c.id === channelId ? updated : c));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteChannel = async (channelId: string) => {
    try {
      await channelService.deleteChannel(channelId);
      setChannels(channels.filter(c => c.id !== channelId));
    } catch (err) {
      throw err;
    }
  };

  return { channels, isLoading, error, createChannel, updateChannel, deleteChannel };
}
