import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { channelService } from '@/services/channelService';
import { toast } from 'sonner';
import { Search, UserPlus } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  channelName: string;
}

export function InviteMemberModal({ isOpen, onClose, channelId, channelName }: InviteMemberModalProps) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (query.length < 2) {
      setUsers([]);
      return;
    }
    const results = await channelService.searchUsers(query);
    setUsers(results);
  };

  const handleInvite = async (userId: string, username: string) => {
    setLoading(true);
    try {
      await channelService.sendInvitation(channelId, userId);
      toast.success(`Invitation sent to @${username}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      toast.error('Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-discord-darker border-discord-darker text-white">
        <DialogHeader>
          <DialogTitle>Invite Members to #{channelName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-discord-muted" />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search users by username..."
              className="pl-10 bg-discord-dark border-discord-dark text-white"
            />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 rounded hover:bg-discord-dark">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-full h-full rounded-full" />
                    ) : (
                      <span className="text-sm">{user.username[0].toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-sm">{user.username}</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleInvite(user.id, user.username)}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {search.length >= 2 && users.length === 0 && (
              <div className="text-center text-discord-muted text-sm py-4">No users found</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
