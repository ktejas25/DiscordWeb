import React, { useState, useRef, useEffect } from 'react';
import { useDMMessages } from '@/hooks/useDMs';
import { useAuth } from '@/contexts/AuthContext';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DMMessageListProps {
  conversationId: string | null;
}

export function DMMessageList({ conversationId }: DMMessageListProps) {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useDMMessages(conversationId);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !conversationId) return;

    try {
      await sendMessage(user.id, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-discord-muted">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-discord-muted">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-discord-muted">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message: any) => {
            const isOwnMessage = message.author_id === user?.id;
            return (
              <div key={message.id} className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                {message.author?.avatar_url ? (
                  <img 
                    src={message.author.avatar_url} 
                    alt={message.author.username} 
                    className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {message.author?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-baseline gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                    <span className="font-semibold text-white text-sm">{message.author?.username || 'Unknown'}</span>
                    <span className="text-xs text-discord-muted">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`mt-1 px-4 py-2 rounded-lg inline-block break-words ${isOwnMessage ? 'bg-primary text-white' : 'bg-discord-darker text-discord-muted'}`}>
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-discord-darker">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-discord-darker border-discord-darker text-white"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
