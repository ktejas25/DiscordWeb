import { supabase } from './supabaseClient';

export const roleService = {
  async getServerRoles(serverId: string) {
    const { data, error } = await supabase
      .from('server_roles')
      .select('*')
      .eq('server_id', serverId)
      .order('position', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createRole(serverId: string, roleData: any) {
    const { data, error } = await supabase
      .from('server_roles')
      .insert({
        server_id: serverId,
        ...roleData
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateRole(roleId: string, updates: any) {
    const { data, error } = await supabase
      .from('server_roles')
      .update(updates)
      .eq('id', roleId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteRole(roleId: string) {
    const { error } = await supabase
      .from('server_roles')
      .delete()
      .eq('id', roleId);
    
    if (error) throw error;
  },

  async getMemberRoles(serverId: string, userId: string) {
    const { data, error } = await supabase
      .from('member_roles')
      .select('*, role:server_roles(*)')
      .eq('server_id', serverId)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async assignRole(serverId: string, userId: string, roleId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('member_roles')
      .insert({
        server_id: serverId,
        user_id: userId,
        role_id: roleId,
        assigned_by: user?.id
      })
      .select('*, role:server_roles(*)')
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeRole(serverId: string, userId: string, roleId: string) {
    const { error } = await supabase
      .from('member_roles')
      .delete()
      .eq('server_id', serverId)
      .eq('user_id', userId)
      .eq('role_id', roleId);
    
    if (error) throw error;
  },

  async getServerMembers(serverId: string) {
    const { data: members, error } = await supabase
      .from('server_members')
      .select('*')
      .eq('server_id', serverId);
    
    if (error) throw error;
    
    // Fetch user profiles separately
    const userIds = members?.map(m => m.user_id) || [];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
    
    // Fetch member roles
    const { data: memberRoles } = await supabase
      .from('member_roles')
      .select('*, role:server_roles(*)')
      .eq('server_id', serverId);
    
    // Combine data
    return members?.map(member => ({
      ...member,
      user: profiles?.find(p => p.id === member.user_id),
      roles: memberRoles?.filter(mr => mr.user_id === member.user_id) || []
    })) || [];
  },

  async updateMember(serverId: string, userId: string, updates: any) {
    const { data, error } = await supabase
      .from('server_members')
      .update(updates)
      .eq('server_id', serverId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
