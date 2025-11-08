import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { messageService } from '@/services/messageService';
import { socketService } from '@/services/socketService';
import { roleService } from '@/services/roleService';
import { getUserRoleColor } from '@/utils/roleUtils';
import { uploadMessageAttachment } from '@/services/storageService';
import { Send, Plus, X, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MemberRole } from '@/types/role';
import { toast } from 'sonner';

interface ChannelChatProps {
  channelId: string;
  channelName: string;
  serverId?: string;
}

export function ChannelChat({ channelId, channelName, serverId }: ChannelChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState<string[]>([]);
  const [userRoles, setUserRoles] = useState<Record<string, MemberRole[]>>({});
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMessages();
    socketService.joinChannel(channelId);

    const handleNewMessage = (message: any) => {
      if (message.channel_id === channelId) {
        setMessages(prev => [...prev, message]);
      }
    };

    const handleTyping = (data: any) => {
      if (data.channelId === channelId && data.userId !== user?.id) {
        setTyping(prev => [...new Set([...prev, data.username])]);
        setTimeout(() => {
          setTyping(prev => prev.filter(u => u !== data.username));
        }, 3000);
      }
    };

    const handleTypingStop = (data: any) => {
      if (data.channelId === channelId) {
        setTyping(prev => prev.filter(u => u !== data.username));
      }
    };

    socketService.onChannelMessageReceived(handleNewMessage);
    socketService.onChannelTyping(handleTyping);
    socketService.onChannelTypingStop(handleTypingStop);

    return () => {
      socketService.leaveChannel(channelId);
      socketService.off('channel:message', handleNewMessage);
      socketService.off('channel:typing', handleTyping);
      socketService.off('channel:typing:stop', handleTypingStop);
    };
  }, [channelId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const data = await messageService.getChannelMessages(channelId);
    setMessages(data);
    if (serverId) {
      const userIds = [...new Set(data.map((m: any) => m.author_id))];
      const rolesMap: Record<string, MemberRole[]> = {};
      for (const userId of userIds) {
        const roles = await roleService.getMemberRoles(serverId, userId);
        rolesMap[userId] = roles;
      }
      setUserRoles(rolesMap);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && selectedImages.length === 0) || !user) return;
    setUploading(true);
    try {
      let attachments: string[] = [];
      if (selectedImages.length > 0) {
        attachments = await Promise.all(
          selectedImages.map(file => uploadMessageAttachment(user.id, file))
        );
      }
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        id: tempId,
        content: input,
        author_id: user.id,
        channel_id: channelId,
        created_at: new Date().toISOString(),
        author: { id: user.id, username: user.username, avatar_url: user.avatar_url },
        attachments
      };
      setMessages(prev => [...prev, optimisticMessage]);
      setInput('');
      setSelectedImages([]);
      socketService.stopChannelTyping(channelId, user.id);
      const message = await messageService.sendMessage(channelId, user.id, input || '', undefined, attachments);
      setMessages(prev => prev.map(m => m.id === tempId ? message : m));
      socketService.sendChannelMessage(channelId, message);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setUploading(false);
    }
  };

  const handleTyping = () => {
    if (!user) return;
    socketService.startChannelTyping(channelId, user.id, user.username);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopChannelTyping(channelId, user.id);
    }, 3000);
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-discord-darker">
        <h2 className="text-xl font-bold text-white"># {channelName}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => {
          const isOwnMessage = msg.author_id === user?.id;
          return (
            <div key={msg.id} className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                {msg.author?.avatar_url ? (
                  <img src={msg.author.avatar_url} alt="" className="w-full h-full rounded-full" />
                ) : (
                  <span className="text-sm">{msg.author?.username?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div className={isOwnMessage ? 'text-right' : ''}>
                <div className={`flex items-baseline gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                  <span className="font-semibold" style={{ color: getUserRoleColor(userRoles[msg.author_id] || []) }}>
                    {msg.author?.username}
                  </span>
                  <span className="text-xs text-discord-muted">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className={`text-white ${isOwnMessage ? 'bg-primary/20 rounded-lg px-3 py-2 inline-block' : ''}`}>{msg.content}</p>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.attachments.map((url: string, idx: number) => (
                      <div key={idx} className="relative group/img">
                        <img
                          src={url}
                          alt="attachment"
                          className="max-w-xs max-h-64 rounded cursor-pointer hover:opacity-90"
                          onClick={() => window.open(url, '_blank')}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(url);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black rounded opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <Download className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {typing.length > 0 && (
          <div className="text-sm text-discord-muted italic">
            {typing.join(', ')} {typing.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-discord-darker">
        {selectedImages.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {selectedImages.map((file, idx) => (
              <div key={idx} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              const imageFiles = files.filter(f => f.type.startsWith('image/'));
              if (imageFiles.length !== files.length) {
                toast.error('Only image files are allowed');
              }
              setSelectedImages(prev => [...prev, ...imageFiles]);
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="p-2 bg-discord-dark hover:bg-discord-darker rounded text-white disabled:opacity-50"
            title="Attach image"
          >
            <Plus className="w-5 h-5" />
          </button>
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => e.key === 'Enter' && !uploading && handleSend()}
            placeholder={`Message #${channelName}`}
            className="bg-discord-dark border-discord-dark text-white"
            disabled={uploading}
          />
          <Button onClick={handleSend} disabled={uploading || (!input.trim() && selectedImages.length === 0)} className="bg-primary hover:bg-primary/90">
            {uploading ? 'Uploading...' : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
