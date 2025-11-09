import { supabase } from './supabaseClient';

export const dmService = {
  async searchUserByUsername(username: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('username', username)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  async getDMConversations(userId: string) {
    try {
      const { data: participantData, error: partError } = await supabase
        .from('dm_participants')
        .select('conversation_id')
        .eq('user_id', userId);

      if (partError) {
        console.error('Error fetching DM participants:', partError?.message || String(partError));
        return [];
      }

      if (!participantData || participantData.length === 0) return [];

      const conversationIds = participantData.map((p: any) => p.conversation_id);

      const { data, error } = await supabase
        .from('dm_conversations')
        .select('*')
        .in('id', conversationIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching DM conversations:', error?.message || String(error));
        return [];
      }

      // Fetch participants with profiles for each conversation
      const conversationsWithParticipants = await Promise.all(
        (data || []).map(async (conv) => {
          const { data: participants } = await supabase
            .from('dm_participants')
            .select('user_id')
            .eq('conversation_id', conv.id);
          
          // Fetch profiles separately
          const participantsWithProfiles = await Promise.all(
            (participants || []).map(async (p) => {
              const { data: profile } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
                .eq('id', p.user_id)
                .single();
              return { user_id: p.user_id, profiles: profile };
            })
          );
          
          return { ...conv, participants: participantsWithProfiles };
        })
      );

      return conversationsWithParticipants;
    } catch (error: any) {
      console.error('Error fetching DM conversations:', error?.message || String(error));
      return [];
    }
  },

  async getOrCreateDMConversation(userId: string, otherUserId: string) {
    try {
      // Check if conversation exists
      const { data: existing } = await supabase
        .from('dm_conversations')
        .select('id')
        .eq('is_group', false)
        .single();

      if (existing) {
        return existing;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from('dm_conversations')
        .insert([{ is_group: false, created_by: userId }])
        .select()
        .single();

      if (error) throw error;

      // Add participants
      await supabase.from('dm_participants').insert([
        { conversation_id: data.id, user_id: userId },
        { conversation_id: data.id, user_id: otherUserId }
      ]);

      return data;
    } catch (error) {
      console.error('Error creating DM conversation:', error);
      throw error;
    }
  },

  async createGroupDM(userId: string, userIds: string[], name?: string) {
    try {
      const { data, error } = await supabase
        .from('dm_conversations')
        .insert([{ is_group: true, created_by: userId, name }])
        .select()
        .single();

      if (error) throw error;

      // Add all participants
      const participants = [userId, ...userIds].map(id => ({
        conversation_id: data.id,
        user_id: id
      }));

      await supabase.from('dm_participants').insert(participants);

      return data;
    } catch (error) {
      console.error('Error creating group DM:', error);
      throw error;
    }
  },

  async getDMMessages(conversationId: string, limit: number = 50, offset: number = 0) {
    try {
      const { data, error } = await supabase
        .from('dm_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      
      // Fetch author profiles separately
      const messagesWithAuthors = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: author } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .eq('id', msg.author_id)
            .single();
          return { ...msg, author };
        })
      );
      
      return messagesWithAuthors.reverse();
    } catch (error) {
      console.error('Error fetching DM messages:', error);
      return [];
    }
  },

  async sendDMMessage(conversationId: string, authorId: string, content: string) {
    try {
      // Get recipient from conversation
      const { data: participants } = await supabase
        .from('dm_participants')
        .select('user_id')
        .eq('conversation_id', conversationId)
        .neq('user_id', authorId);
      
      if (participants && participants.length > 0) {
        const recipientId = participants[0].user_id;
        // Check recipient's privacy settings
        const { data: recipientSettings } = await supabase
          .from('user_settings')
          .select('settings')
          .eq('user_id', recipientId)
          .single();
        
        if (recipientSettings?.settings?.privacy?.allowDMsFromServerMembers === false) {
          throw new Error('This user does not accept direct messages.');
        }
      }

      const { data, error } = await supabase
        .from('dm_messages')
        .insert([{ conversation_id: conversationId, author_id: authorId, content }])
        .select('*')
        .single();

      if (error) throw error;
      
      // Fetch author profile separately
      const { data: author } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('id', authorId)
        .single();
      
      return { ...data, author };
    } catch (error) {
      console.error('Error sending DM:', error);
      throw error;
    }
  },

  async updateDMMessage(messageId: string, content: string) {
    try {
      const { data, error } = await supabase
        .from('dm_messages')
        .update({ content, edited_at: new Date().toISOString() })
        .eq('id', messageId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating DM message:', error);
      throw error;
    }
  },

  async deleteDMMessage(messageId: string) {
    try {
      const { error } = await supabase
        .from('dm_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting DM message:', error);
      throw error;
    }
  },

  subscribeToDMMessages(conversationId: string, callback: (message: any) => void) {
    return supabase
      .channel(`dm:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dm_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        callback
      )
      .subscribe();
  }
};
