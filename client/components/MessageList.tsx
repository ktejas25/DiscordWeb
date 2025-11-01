import React, { useEffect, useRef, useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Trash2, Edit2, Smile } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MessageListProps {
  channelId: string | null;
  channelType?: 'text' | 'voice';
}

export function MessageList({ channelId, channelType = 'text' }: MessageListProps) {
  const { messages, isLoading, sendMessage, deleteMessage, updateMessage } = useMessages(channelId);
  const { user } = useAuth();
  const [messageContent, setMessageContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await sendMessage(user.id, messageContent);
      setMessageContent('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSubmitting(false);
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
                  <span className="font-semibold text-white">
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
                  <p className="text-discord-muted break-words">{message.content}</p>
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
        <div className="flex gap-2">
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
            disabled={isSubmitting || !messageContent.trim()}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
