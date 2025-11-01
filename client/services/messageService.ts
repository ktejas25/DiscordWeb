import { supabase } from './supabaseClient';
import { Message } from '@shared/api';

export const messageService = {
  async getChannelMessages(channelId: string, limit: number = 50, offset: number = 0) {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching messages:', error?.message || String(error));
        return [];
      }

      const authorIds = [...new Set(messages?.map(m => m.author_id))];
      console.log('Author IDs:', authorIds);
      
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', authorIds);

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
      }
      console.log('Profiles fetched:', profiles);

      const messagesWithAuthors = (messages || []).map(msg => {
        const author = profiles?.find(p => p.id === msg.author_id);
        console.log(`Message ${msg.id} author_id: ${msg.author_id}, found author:`, author);
        return {
          ...msg,
          author
        };
      });

      return messagesWithAuthors.reverse() as any[];
    } catch (error: any) {
      console.error('Error fetching messages:', error?.message || String(error));
      return [];
    }
  },

  async sendMessage(channelId: string, authorId: string, content: string, reply_to?: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          { channel_id: channelId, author_id: authorId, content, reply_to }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async updateMessage(messageId: string, content: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ content, edited_at: new Date().toISOString() })
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;
      return data as Message;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  },

  async deleteMessage(messageId: string) {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  async addReaction(messageId: string, userId: string, emoji: string) {
    try {
      const { data, error } = await supabase
        .from('message_reactions')
        .insert([{ message_id: messageId, user_id: userId, emoji }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  },

  async removeReaction(messageId: string, userId: string, emoji: string) {
    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .eq('emoji', emoji);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw error;
    }
  },

  async getMessageReactions(messageId: string) {
    try {
      const { data, error } = await supabase
        .from('message_reactions')
        .select(`
          *,
          user:user_id(id, username, avatar_url)
        `)
        .eq('message_id', messageId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching message reactions:', error);
      return [];
    }
  },

  subscribeToChannelMessages(channelId: string, callback: (message: any) => void) {
    return supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'api',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        callback
      )
      .subscribe();
  }
};
