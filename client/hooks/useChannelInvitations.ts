import { useState, useEffect } from 'react';
import { channelService } from '@/services/channelService';
import { socketService } from '@/services/socketService';
import { useAuth } from '@/contexts/AuthContext';

export function useChannelInvitations() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvitations();

    if (user) {
      socketService.onChannelInvitation(user.id, (data: any) => {
        setInvitations(prev => [...prev, data]);
      });
    }
  }, [user]);

  const loadInvitations = async () => {
    setIsLoading(true);
    const data = await channelService.getPendingInvitations();
    setInvitations(data);
    setIsLoading(false);
  };

  const acceptInvitation = async (invitationId: string) => {
    await channelService.acceptInvitation(invitationId);
    setInvitations(invitations.filter(i => i.id !== invitationId));
  };

  const declineInvitation = async (invitationId: string) => {
    await channelService.declineInvitation(invitationId);
    setInvitations(invitations.filter(i => i.id !== invitationId));
  };

  return {
    invitations,
    isLoading,
    acceptInvitation,
    declineInvitation,
    refresh: loadInvitations
  };
}
