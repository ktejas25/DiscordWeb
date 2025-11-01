import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dmService } from '@/services/dmService';

export function useDMs() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const data = await dmService.getDMConversations(user.id);
        setConversations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  const getOrCreateConversation = useCallback(async (otherUserId: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      const conversation = await dmService.getOrCreateDMConversation(user.id, otherUserId);
      // Refresh conversations to get participant data
      const data = await dmService.getDMConversations(user.id);
      setConversations(data);
      return conversation;
    } catch (err) {
      throw err;
    }
  }, [user]);

  const createGroupDM = useCallback(async (userIds: string[], name?: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      const conversation = await dmService.createGroupDM(user.id, userIds, name);
      setConversations([conversation, ...conversations]);
      return conversation;
    } catch (err) {
      throw err;
    }
  }, [user, conversations]);

  return {
    conversations,
    isLoading,
    error,
    getOrCreateConversation,
    createGroupDM
  };
}

export function useDMMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const data = await dmService.getDMMessages(conversationId, 50, 0);
        setMessages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const subscription = dmService.subscribeToDMMessages(conversationId, (payload) => {
      if (payload.eventType === 'INSERT') {
        setMessages(prev => [...prev, payload.new]);
      } else if (payload.eventType === 'UPDATE') {
        setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
      } else if (payload.eventType === 'DELETE') {
        setMessages(prev => prev.filter(m => m.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId]);

  const sendMessage = useCallback(async (authorId: string, content: string) => {
    if (!conversationId) throw new Error('No conversation selected');
    try {
      const newMessage = await dmService.sendDMMessage(conversationId, authorId, content);
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      throw err;
    }
  }, [conversationId]);

  const updateMessage = useCallback(async (messageId: string, content: string) => {
    try {
      await dmService.updateDMMessage(messageId, content);
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await dmService.deleteDMMessage(messageId);
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    updateMessage,
    deleteMessage
  };
}
