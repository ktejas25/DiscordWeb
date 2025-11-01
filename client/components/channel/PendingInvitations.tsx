import React, { useEffect, useState } from 'react';
import { channelService } from '@/services/channelService';
import { socketService } from '@/services/socketService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Check, X, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function PendingInvitations() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);

  useEffect(() => {
    loadInvitations();

    if (user) {
      socketService.onChannelInvitation(user.id, (data: any) => {
        setInvitations(prev => [...prev, data]);
        toast.info(`You've been invited to join #${data.channel?.name}`);
      });
    }
  }, [user]);

  const loadInvitations = async () => {
    console.log('Loading invitations...');
    const data = await channelService.getPendingInvitations();
    console.log('Loaded invitations:', data);
    setInvitations(data);
  };

  const handleAccept = async (invitationId: string, channelName: string) => {
    try {
      await channelService.acceptInvitation(invitationId);
      setInvitations(invitations.filter(i => i.id !== invitationId));
      toast.success(`Joined #${channelName}`);
    } catch (error) {
      toast.error('Failed to accept invitation');
    }
  };

  const handleDecline = async (invitationId: string) => {
    try {
      await channelService.declineInvitation(invitationId);
      setInvitations(invitations.filter(i => i.id !== invitationId));
      toast.success('Invitation declined');
    } catch (error) {
      toast.error('Failed to decline invitation');
    }
  };

  console.log('PendingInvitations render, count:', invitations.length);
  if (invitations.length === 0) return null;

  return (
    <div className="p-4 bg-discord-dark border-b border-discord-darker">
      <div className="flex items-center gap-2 mb-3 text-white">
        <Mail className="w-4 h-4" />
        <span className="font-semibold">Pending Invitations</span>
      </div>
      <div className="space-y-2">
        {invitations.map(inv => (
          <div key={inv.id} className="flex items-center justify-between p-2 bg-discord-darker rounded">
            <div className="flex-1">
              <p className="text-sm text-white">
                <span className="font-semibold">{inv.inviter?.username}</span> invited you to{' '}
                <span className="font-semibold">#{inv.channel?.name}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleAccept(inv.id, inv.channel?.name)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => handleDecline(inv.id)}
                variant="outline"
                className="border-discord-muted"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
