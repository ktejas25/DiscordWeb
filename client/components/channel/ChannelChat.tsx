import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { messageService } from '@/services/messageService';
import { socketService } from '@/services/socketService';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChannelChatProps {
  channelId: string;
  channelName: string;
}

export function ChannelChat({ channelId, channelName }: ChannelChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

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
  };

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      content: input,
      author_id: user.id,
      channel_id: channelId,
      created_at: new Date().toISOString(),
      author: { id: user.id, username: user.username, avatar_url: user.avatar_url }
    };
    setMessages(prev => [...prev, optimisticMessage]);
    setInput('');
    socketService.stopChannelTyping(channelId, user.id);
    try {
      const message = await messageService.sendMessage(channelId, user.id, input);
      setMessages(prev => prev.map(m => m.id === tempId ? message : m));
      socketService.sendChannelMessage(channelId, message);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.filter(m => m.id !== tempId));
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
                  <span className="font-semibold text-white">{msg.author?.username}</span>
                  <span className="text-xs text-discord-muted">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className={`text-white ${isOwnMessage ? 'bg-primary/20 rounded-lg px-3 py-2 inline-block' : ''}`}>{msg.content}</p>
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
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message #${channelName}`}
            className="bg-discord-dark border-discord-dark text-white"
          />
          <Button onClick={handleSend} className="bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
