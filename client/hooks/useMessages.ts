import { useState, useEffect, useCallback } from 'react';
import { messageService } from '@/services/messageService';

export function useMessages(channelId: string | null) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!channelId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const data = await messageService.getChannelMessages(channelId, 50, 0);
        setMessages(data);
        setHasMore(data.length === 50);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const subscription = messageService.subscribeToChannelMessages(channelId, async (payload) => {
      if (payload.eventType === 'INSERT') {
        const { supabase } = await import('@/services/supabaseClient');
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', payload.new.author_id)
          .single();
        setMessages(prev => [...prev, { ...payload.new, author: profile }]);
      } else if (payload.eventType === 'UPDATE') {
        setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
      } else if (payload.eventType === 'DELETE') {
        setMessages(prev => prev.filter(m => m.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [channelId]);

  const sendMessage = useCallback(async (authorId: string, content: string, reply_to?: string, attachments?: string[]) => {
    if (!channelId) throw new Error('No channel selected');
    try {
      const newMessage = await messageService.sendMessage(channelId, authorId, content, reply_to, attachments);
      const { supabase } = await import('@/services/supabaseClient');
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', authorId)
        .single();
      setMessages(prev => [...prev, { ...newMessage, author: profile }]);
      return newMessage;
    } catch (err) {
      throw err;
    }
  }, [channelId]);

  const updateMessage = useCallback(async (messageId: string, content: string) => {
    try {
      await messageService.updateMessage(messageId, content);
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await messageService.deleteMessage(messageId);
    } catch (err) {
      throw err;
    }
  }, []);

  const addReaction = useCallback(async (messageId: string, userId: string, emoji: string) => {
    try {
      await messageService.addReaction(messageId, userId, emoji);
    } catch (err) {
      throw err;
    }
  }, []);

  const removeReaction = useCallback(async (messageId: string, userId: string, emoji: string) => {
    try {
      await messageService.removeReaction(messageId, userId, emoji);
    } catch (err) {
      throw err;
    }
  }, []);

  const loadMore = useCallback(async (offset: number) => {
    if (!channelId) return;
    try {
      const olderMessages = await messageService.getChannelMessages(channelId, 50, offset);
      if (olderMessages.length < 50) setHasMore(false);
      setMessages(prev => [...olderMessages, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more messages');
    }
  }, [channelId]);

  return {
    messages,
    isLoading,
    error,
    hasMore,
    sendMessage,
    updateMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    loadMore
  };
}
