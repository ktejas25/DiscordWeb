import { supabase } from './supabaseClient';
import { Channel } from '@shared/api';

export const channelService = {
  async getServerChannels(serverId: string) {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .eq('server_id', serverId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching channels:', error?.message || String(error));
        return [];
      }
      return data as Channel[];
    } catch (error: any) {
      console.error('Error fetching channels:', error?.message || String(error));
      return [];
    }
  },

  async getChannelById(channelId: string) {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .eq('id', channelId)
        .single();

      if (error) throw error;
      return data as Channel;
    } catch (error) {
      console.error('Error fetching channel:', error);
      return null;
    }
  },

  async createChannel(serverId: string, name: string, type: 'text' | 'voice' = 'text', is_private: boolean = false) {
    try {
      const { data, error } = await supabase
        .from('channels')
        .insert([{ server_id: serverId, name, type, is_private }])
        .select()
        .single();

      if (error) throw error;
      return data as Channel;
    } catch (error) {
      console.error('Error creating channel:', error);
      throw error;
    }
  },

  async updateChannel(channelId: string, updates: Partial<Channel>) {
    try {
      const { data, error } = await supabase
        .from('channels')
        .update(updates)
        .eq('id', channelId)
        .select()
        .single();

      if (error) throw error;
      return data as Channel;
    } catch (error) {
      console.error('Error updating channel:', error);
      throw error;
    }
  },

  async deleteChannel(channelId: string) {
    try {
      const { error } = await supabase
        .from('channels')
        .delete()
        .eq('id', channelId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting channel:', error);
      throw error;
    }
  },

  async getChannelMembers(channelId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`/api/channels/${channelId}/members`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching channel members:', error);
      return [];
    }
  },

  async addChannelMember(channelId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('channel_members')
        .insert([{ channel_id: channelId, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding channel member:', error);
      throw error;
    }
  },

  async removeChannelMember(channelId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('channel_members')
        .delete()
        .eq('channel_id', channelId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing channel member:', error);
      throw error;
    }
  },

  async sendInvitation(channelId: string, inviteeId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`/api/channels/${channelId}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ inviteeId })
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Invitation failed:', errorData);
        throw new Error(errorData.error || 'Failed to send invitation');
      }
      return await response.json();
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw error;
    }
  },

  async getPendingInvitations() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/invitations/pending', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching invitations:', error);
      return [];
    }
  },

  async acceptInvitation(invitationId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`/api/invitations/${invitationId}/accept`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (!response.ok) throw new Error('Failed to accept invitation');
      return await response.json();
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  },

  async declineInvitation(invitationId: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`/api/invitations/${invitationId}/decline`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (!response.ok) throw new Error('Failed to decline invitation');
      return await response.json();
    } catch (error) {
      console.error('Error declining invitation:', error);
      throw error;
    }
  },

  async searchUsers(query: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${query}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }
};
