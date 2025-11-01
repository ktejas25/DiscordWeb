import { useState, useEffect } from 'react';
import { channelService } from '@/services/channelService';
import { socketService } from '@/services/socketService';

export function useChannelMembers(channelId: string | null) {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!channelId) {
      setMembers([]);
      setIsLoading(false);
      return;
    }

    loadMembers();

    const handleMemberJoined = (data: any) => {
      if (data.channelId === channelId) {
        setMembers(prev => [...prev, data.user]);
      }
    };

    const handleMemberLeft = (data: any) => {
      if (data.channelId === channelId) {
        setMembers(prev => prev.filter(m => m.user_id !== data.userId));
      }
    };

    socketService.onMemberJoined(handleMemberJoined);
    socketService.onMemberLeft(handleMemberLeft);

    return () => {
      socketService.off('member:joined', handleMemberJoined);
      socketService.off('member:left', handleMemberLeft);
    };
  }, [channelId]);

  const loadMembers = async () => {
    if (!channelId) return;
    setIsLoading(true);
    const data = await channelService.getChannelMembers(channelId);
    setMembers(data);
    setIsLoading(false);
  };

  const removeMember = async (userId: string) => {
    if (!channelId) return;
    await channelService.removeChannelMember(channelId, userId);
    setMembers(members.filter(m => m.user_id !== userId));
  };

  const leaveChannel = async () => {
    if (!channelId) return;
    await channelService.removeChannelMember(channelId, '');
  };

  return {
    members,
    isLoading,
    removeMember,
    leaveChannel,
    refresh: loadMembers
  };
}
