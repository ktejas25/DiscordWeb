import React, { useEffect, useRef, useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { roleService } from '@/services/roleService';
import { getUserRoleColor } from '@/utils/roleUtils';
import { MessageCircle, Trash2, Edit2, Smile, Plus, X, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MemberRole } from '@/types/role';
import { uploadMessageAttachment } from '@/services/storageService';

interface MessageListProps {
  channelId: string | null;
  channelType?: 'text' | 'voice';
  serverId?: string;
}

export function MessageList({ channelId, channelType = 'text', serverId }: MessageListProps) {
  const { messages, isLoading, sendMessage, deleteMessage, updateMessage } = useMessages(channelId);
  const { user } = useAuth();
  const [messageContent, setMessageContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [userRoles, setUserRoles] = useState<Record<string, MemberRole[]>>({});
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (serverId && messages.length > 0) {
      const fetchRoles = async () => {
        const userIds = [...new Set(messages.map(m => m.author_id))];
        const rolesMap: Record<string, MemberRole[]> = {};
        for (const userId of userIds) {
          const roles = await roleService.getMemberRoles(serverId, userId);
          rolesMap[userId] = roles;
        }
        setUserRoles(rolesMap);
      };
      fetchRoles();
    }
  }, [serverId, messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageContent.trim() && selectedImages.length === 0) || !user) return;

    setIsSubmitting(true);
    setUploading(true);
    try {
      let attachments: string[] = [];
      if (selectedImages.length > 0) {
        attachments = await Promise.all(
          selectedImages.map(file => uploadMessageAttachment(user.id, file))
        );
      }
      await sendMessage(user.id, messageContent || '', undefined, attachments);
      setMessageContent('');
      setSelectedImages([]);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length !== files.length) {
      toast.error('Only image files are allowed');
    }
    setSelectedImages(prev => [...prev, ...imageFiles]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
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

  const handleDeleteMessage = async (messageId: string) => {
    if (confirm('Delete this message?')) {
      try {
        await deleteMessage(messageId);
      } catch (error) {
        toast.error('Failed to delete message');
      }
    }
  };

  const handleEditMessage = async (messageId: string) => {
    if (!editContent.trim()) return;
    try {
      await updateMessage(messageId, editContent);
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  if (!channelId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-discord-dark">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-discord-muted mx-auto mb-4 opacity-50" />
          <p className="text-discord-muted">Select a channel to start messaging</p>
        </div>
      </div>
    );
  }

  if (channelType === 'voice') {
    return (
      <div className="flex-1 flex items-center justify-center bg-discord-dark">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-discord-muted mx-auto mb-4 opacity-50" />
          <p className="text-discord-muted">Voice channel</p>
          <p className="text-xs text-discord-muted mt-2">Join from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-discord-dark">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-discord-muted">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-discord-muted">
            No messages yet. Be the first to chat!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="group flex gap-3 p-3 rounded hover:bg-discord-darker/50 transition"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                {message.author?.username?.charAt(0).toUpperCase() || 'U'}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold" style={{ color: getUserRoleColor(userRoles[message.author_id] || []) }}>
                    {message.author?.username || 'Unknown User'}
                  </span>
                  <span className="text-xs text-discord-muted">
                    {format(new Date(message.created_at), 'HH:mm')}
                  </span>
                  {message.edited_at && (
                    <span className="text-xs text-discord-muted">(edited)</span>
                  )}
                </div>

                {editingId === message.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 bg-discord-dark border border-primary rounded px-2 py-1 text-white text-sm"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleEditMessage(message.id)}
                      className="bg-primary text-white"
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                      className="text-discord-muted"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    {message.content && <p className="text-discord-muted break-words">{message.content}</p>}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.attachments.map((url, idx) => (
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
                  </>
                )}

                {/* Reactions */}
                {message.message_reactions && message.message_reactions.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {Array.from(
                      new Map(
                        message.message_reactions.map((r: any) => [r.emoji, r])
                      ).values()
                    ).map((reaction: any) => {
                      const count = message.message_reactions.filter(
                        (r: any) => r.emoji === reaction.emoji
                      ).length;
                      return (
                        <div
                          key={reaction.emoji}
                          className="flex items-center gap-1 bg-discord-darker rounded-full px-2 py-1 text-sm text-discord-muted hover:bg-discord-darker/80 cursor-pointer"
                        >
                          <span>{reaction.emoji}</span>
                          <span>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Actions */}
              {user?.id === message.author_id && (
                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                  <button
                    onClick={() => {
                      setEditingId(message.id);
                      setEditContent(message.content);
                    }}
                    className="p-1 rounded hover:bg-discord-dark text-discord-muted hover:text-white transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(message.id)}
                    className="p-1 rounded hover:bg-discord-dark text-discord-muted hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-discord-darker">
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
                  onClick={() => removeImage(idx)}
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
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="p-2 bg-discord-darker hover:bg-discord-dark rounded text-white disabled:opacity-50"
            title="Attach image"
          >
            <Plus className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type a message..."
            disabled={isSubmitting}
            className="flex-1 bg-discord-darker border border-discord-darker rounded-lg px-4 py-2 text-white placeholder:text-discord-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            type="submit"
            disabled={isSubmitting || (!messageContent.trim() && selectedImages.length === 0)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {uploading ? 'Uploading...' : 'Send'}
          </Button>
        </div>
      </form>
    </div>
  );
}
