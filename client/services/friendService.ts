import { supabase } from './supabaseClient';

export const friendService = {
  async getFriends(userId: string, status: 'accepted' | 'pending' | 'blocked' = 'accepted') {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .eq('user_id', userId)
        .eq('status', status);

      if (error) {
        console.error('Error fetching friends:', error?.message || String(error));
        return [];
      }
      return data || [];
    } catch (error: any) {
      console.error('Error fetching friends:', error?.message || String(error));
      return [];
    }
  },

  async sendFriendRequest(senderId: string, recipientUsername: string, message?: string) {
    try {
      // Find recipient by username
      const { data: recipientData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', recipientUsername)
        .single();

      if (userError) throw new Error('User not found');

      // Check recipient's privacy settings
      const { data: recipientSettings } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', recipientData.id)
        .single();
      
      if (recipientSettings?.settings?.privacy?.allowFriendRequests === false) {
        throw new Error('This user does not accept friend requests.');
      }

      const { data, error } = await supabase
        .from('friendships')
        .insert([
          {
            user_id: senderId,
            friend_id: recipientData.id,
            status: 'pending',
            message
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  },

  async acceptFriendRequest(friendshipId: string) {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  },

  async rejectFriendRequest(friendshipId: string) {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      throw error;
    }
  },

  async removeFriend(userId: string, friendId: string) {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', userId)
        .eq('friend_id', friendId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  },

  async blockUser(userId: string, blockedUserId: string) {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .insert([
          { user_id: userId, friend_id: blockedUserId, status: 'blocked' }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  },

  async unblockUser(userId: string, blockedUserId: string) {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', userId)
        .eq('friend_id', blockedUserId)
        .eq('status', 'blocked');

      if (error) throw error;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  },

  async getPendingRequests(userId: string) {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          requester:user_id(id, username, display_name, avatar_url, status)
        `)
        .eq('friend_id', userId)
        .eq('status', 'pending');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return [];
    }
  }
};
