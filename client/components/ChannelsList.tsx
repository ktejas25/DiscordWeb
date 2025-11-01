import React, { useState, useEffect } from 'react';
import { useChannels } from '@/hooks/useChannels';
import { useServerPresence } from '@/hooks/useServerPresence';
import { Plus, Hash, Trash2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VoiceChannelItem } from './VoiceChannelItem';
import { SelfFooter } from './SelfFooter';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ChannelsListProps {
  serverId: string | null;
  selectedChannelId: string | null;
  onChannelSelect: (channelId: string, channelType?: 'text' | 'voice') => void;
}

export function ChannelsList({ serverId, selectedChannelId, onChannelSelect }: ChannelsListProps) {
  const { user } = useAuth();
  const { channels, isLoading, createChannel, deleteChannel } = useChannels(serverId);
  const { textByChannel, voiceByChannel, setActiveText, joinVoice: joinVoicePresence } = useServerPresence(serverId);
  const [selfMuted, setSelfMuted] = useState(false);
  const [selfDeafened, setSelfDeafened] = useState(false);

  useEffect(() => {
    if (selectedChannelId) {
      const channel = channels.find(c => c.id === selectedChannelId);
      if (channel?.type === 'text') {
        setActiveText(selectedChannelId);
      }
    }
  }, [selectedChannelId, channels, setActiveText]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textChannels = channels.filter(c => c.type === 'text');
  const voiceChannels = channels.filter(c => c.type === 'voice');

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) {
      toast.error('Channel name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const newChannel = await createChannel(channelName, channelType, isPrivate);
      setChannelName('');
      setIsCreateOpen(false);
      onChannelSelect(newChannel.id, channelType);
      toast.success('Channel created successfully');
    } catch (error) {
      toast.error('Failed to create channel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteChannel = async (channelId: string, channelName: string) => {
    if (confirm(`Are you sure you want to delete #${channelName}?`)) {
      try {
        await deleteChannel(channelId);
        toast.success('Channel deleted');
      } catch (error) {
        toast.error('Failed to delete channel');
      }
    }
  };

  if (!serverId) {
    return (
      <div className="w-60 bg-discord-darker border-r border-discord-darker p-4 text-center text-discord-muted">
        Select a server to view channels
      </div>
    );
  }

  return (
    <div className="w-60 bg-discord-darker border-r border-discord-darker flex flex-col h-full">
      <div className="p-4 border-b border-discord-darker flex items-center justify-between">
        <h2 className="font-bold text-white truncate">Server Channels</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <button className="text-discord-muted hover:text-white transition">
              <Plus className="w-4 h-4" />
            </button>
          </DialogTrigger>
          <DialogContent className="bg-discord-darker border-discord-darker text-white">
            <DialogHeader>
              <DialogTitle>Create a channel</DialogTitle>
              <DialogDescription>Create a new text or voice channel for your server</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Channel Name</label>
                <Input
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="general"
                  disabled={isSubmitting}
                  className="bg-discord-dark border-discord-dark text-white placeholder:text-discord-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Channel Type</label>
                <Select value={channelType} onValueChange={(value: any) => setChannelType(value)}>
                  <SelectTrigger className="bg-discord-dark border-discord-dark text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-discord-darker border-discord-darker">
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="voice">Voice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="private" className="text-sm">Private Channel</label>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
                {isSubmitting ? 'Creating...' : 'Create Channel'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {isLoading ? (
          <div className="text-center text-discord-muted py-4">Loading channels...</div>
        ) : channels.length === 0 ? (
          <div className="text-center text-discord-muted text-sm py-4">No channels yet</div>
        ) : (
          <>
            {/* Text Channels */}
            {textChannels.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-semibold text-discord-muted uppercase px-2 mb-1">Text Channels</div>
                {textChannels.map((channel) => {
                  const users = textByChannel.get(channel.id) || [];
                  return (
                    <div key={channel.id} className="space-y-1">
                      <div
                        onClick={() => onChannelSelect(channel.id, 'text')}
                        className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors group ${
                          selectedChannelId === channel.id
                            ? 'bg-discord-dark text-white'
                            : 'text-discord-muted hover:bg-discord-dark/50 hover:text-white'
                        }`}
                      >
                        <Hash className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 truncate text-sm font-medium">{channel.name}</span>
                        {selectedChannelId === channel.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChannel(channel.id, channel.name);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-discord-muted hover:text-red-500 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {users.length > 0 && (
                        <div className="ml-6 space-y-1">
                          {users.map(u => (
                            <div key={u.userId} className="flex items-center gap-2 px-2 py-1 text-sm text-discord-muted">
                              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                                {u.avatarUrl ? <img src={u.avatarUrl} alt="" className="w-full h-full rounded-full" /> : u.username[0].toUpperCase()}
                              </div>
                              <span>{u.username}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Voice Channels */}
            {voiceChannels.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs font-semibold text-discord-muted uppercase px-2 mb-1">Voice Channels</div>
                {voiceChannels.map((channel) => {
                  const users = voiceByChannel.get(channel.id) || [];
                  return (
                    <div key={channel.id} className="space-y-1">
                      <div className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors text-discord-muted hover:bg-discord-dark/50 hover:text-white group">
                        <Volume2 className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 truncate text-sm font-medium">{channel.name}</span>
                        <button
                          onClick={() => joinVoicePresence(channel.id)}
                          className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 rounded bg-primary hover:bg-primary/90 transition"
                        >
                          Join
                        </button>
                      </div>
                      {users.length > 0 && (
                        <div className="ml-6 space-y-1">
                          {users.map(u => (
                            <div key={u.userId} className="flex items-center gap-2 px-2 py-1 text-sm text-discord-muted">
                              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                                {u.avatarUrl ? <img src={u.avatarUrl} alt="" className="w-full h-full rounded-full" /> : u.username[0].toUpperCase()}
                              </div>
                              <span>{u.username}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <SelfFooter
        muted={selfMuted}
        deafened={selfDeafened}
        onToggleMute={() => setSelfMuted(!selfMuted)}
        onToggleDeafen={() => setSelfDeafened(!selfDeafened)}
      />
    </div>
  );
}
