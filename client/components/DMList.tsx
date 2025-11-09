import React, { useState } from 'react';
import { useDMs } from '@/hooks/useDMs';
import { Plus, User, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { dmService } from '@/services/dmService';
import { SelfFooter } from './SelfFooter';

interface DMListProps {
  selectedConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
}

export function DMList({ selectedConversationId, onConversationSelect }: DMListProps) {
  const { conversations, isLoading, getOrCreateConversation } = useDMs();
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [muted, setMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);

  const handleStartDM = async () => {
    if (!searchUsername.trim() || !user) {
      toast.error('Please enter a username');
      return;
    }

    try {
      const users = await dmService.searchUserByUsername(searchUsername);
      if (users.length === 0) {
        toast.error('User not found');
        return;
      }
      const targetUser = users[0];
      const conversation = await getOrCreateConversation(targetUser.id);
      onConversationSelect(conversation.id);
      toast.success(`Started conversation with ${targetUser.username}`);
      setSearchUsername('');
      setIsCreateOpen(false);
    } catch (error: any) {
      const message = error?.message || 'Failed to start conversation';
      toast.error(message);
    }
  };

  return (
    <div className="w-60 bg-discord-darker border-r border-discord-darker flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-discord-darker flex items-center justify-between">
        <h2 className="font-bold text-white">Direct Messages</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <button className="text-discord-muted hover:text-white transition">
              <Plus className="w-4 h-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="bg-discord-darker border-discord-darker text-white">
            <DialogHeader>
              <DialogTitle>Start a conversation</DialogTitle>
              <DialogDescription>Search for a user to start a direct message</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <Input
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="Search username..."
                  className="bg-discord-dark border-discord-dark text-white placeholder:text-discord-muted"
                />
              </div>
              <Button
                onClick={handleStartDM}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Start Conversation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 pb-16">
        {isLoading ? (
          <div className="text-center text-discord-muted py-4 text-sm">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-discord-muted text-sm py-4">No conversations yet</div>
        ) : (
          conversations.map((conversation) => {
            const otherParticipants = conversation.participants?.filter(
              (p: any) => p.user_id !== user?.id
            ) || [];

            return (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(
                  selectedConversationId === conversation.id ? null : conversation.id
                )}
                className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors ${
                  selectedConversationId === conversation.id
                    ? 'bg-discord-dark text-white'
                    : 'text-discord-muted hover:bg-discord-dark/50 hover:text-white'
                }`}
              >
                <div className="flex-shrink-0">
                  {conversation.is_group ? (
                    <Users className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {conversation.is_group
                      ? conversation.name || `Group (${otherParticipants.length})`
                      : otherParticipants[0]?.profiles?.username || 'Unknown'}
                  </p>
                  {conversation.last_message && (
                    <p className="text-xs text-discord-muted truncate">
                      {conversation.last_message.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Footer */}
      <SelfFooter 
        muted={muted}
        deafened={deafened}
        onToggleMute={() => setMuted(!muted)}
        onToggleDeafen={() => setDeafened(!deafened)}
      />
    </div>
  );
}
