import { supabase } from './supabaseClient';
import { Server } from '@shared/api';

export const serverService = {
  async getServers(userId: string) {
    try {
      // Query server_members to find all servers for this user
      const { data: serverMembers, error: memberError } = await supabase
        .from('server_members')
        .select('server_id')
        .eq('user_id', userId);

      if (memberError) {
        console.error('Error fetching server members:', memberError?.message || String(memberError));
        return [];
      }

      if (!serverMembers || serverMembers.length === 0) {
        return [];
      }

      const serverIds = serverMembers.map((m: any) => m.server_id);

      // Query servers table
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .in('id', serverIds);

      if (error) {
        console.error('Error fetching servers:', error?.message || String(error));
        return [];
      }

      return data as Server[];
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      console.error('Error fetching servers caught:', errorMessage);
      return [];
    }
  },

  async getServerById(serverId: string) {
    try {
      const { data, error } = await supabase
        .from('servers')
        .select('*')
        .eq('id', serverId)
        .single();

      if (error) throw error;
      return data as Server;
    } catch (error) {
      console.error('Error fetching server:', error);
      return null;
    }
  },

  async createServer(userId: string, name: string, icon_url?: string) {
    try {
      const { data, error } = await supabase
        .from('servers')
        .insert([{ name, icon_url, owner_id: userId }])
        .select()
        .single();

      if (error) throw error;

      // FIXED: Add creator as owner - now properly checks for errors
      const { error: memberError } = await supabase.from('server_members').insert([
        { server_id: data.id, user_id: userId, role: 'owner' }
      ]);

      if (memberError) throw memberError; // FIXED: Added error check

      // FIXED: Create default general channel - now properly checks for errors
      const { error: channelError } = await supabase.from('channels').insert([
        { server_id: data.id, name: 'general', type: 'text', is_private: false }
      ]);

      if (channelError) throw channelError; // FIXED: Added error check

      return data as Server;
    } catch (error: any) {
      // Log detailed error for debugging
      console.error('Error creating server:', error);
      console.error('Error details:', error?.message, error?.details, error?.hint);
      throw error;
    }
  },

  async updateServer(serverId: string, updates: Partial<Server>) {
    try {
      const { data, error } = await supabase
        .from('servers')
        .update(updates)
        .eq('id', serverId)
        .select()
        .single();

      if (error) throw error;
      return data as Server;
    } catch (error) {
      console.error('Error updating server:', error);
      throw error;
    }
  },

  async deleteServer(serverId: string) {
    try {
      const { error } = await supabase
        .from('servers')
        .delete()
        .eq('id', serverId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting server:', error);
      throw error;
    }
  },

  async getServerMembers(serverId: string) {
    try {
      const { data, error } = await supabase
        .from('server_members')
        .select('*')
        .eq('server_id', serverId);

      if (error) {
        console.error('Error fetching server members:', error?.message || String(error));
        return [];
      }

      return data || [];
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      console.error('Error fetching server members caught:', errorMessage);
      return [];
    }
  },

  async addServerMember(serverId: string, userId: string, role: string = 'member') {
    try {
      const { data, error } = await supabase
        .from('server_members')
        .insert([{ server_id: serverId, user_id: userId, role }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding server member:', error);
      throw error;
    }
  },

  async removeServerMember(serverId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('server_members')
        .delete()
        .eq('server_id', serverId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing server member:', error);
      throw error;
    }
  },

  async updateServerMemberRole(serverId: string, userId: string, role: string) {
    try {
      const { data, error } = await supabase
        .from('server_members')
        .update({ role })
        .eq('server_id', serverId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating server member role:', error);
      throw error;
    }
  }
};
