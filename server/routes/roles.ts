import { Router } from 'express';
import { supabase } from '../supabaseClient';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all server roles
router.get('/servers/:serverId/roles', authenticateToken, async (req, res) => {
  const { serverId } = req.params;
  
  const { data, error } = await supabase
    .from('server_roles')
    .select('*')
    .eq('server_id', serverId)
    .order('position', { ascending: false });
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Create custom role
router.post('/servers/:serverId/roles', authenticateToken, async (req, res) => {
  const { serverId } = req.params;
  const { name, color, category, permissions, mentionable, position } = req.body;
  
  const { data: server } = await supabase
    .from('servers')
    .select('owner_id')
    .eq('id', serverId)
    .single();
  
  if (!server || server.owner_id !== req.user.id) {
    return res.status(403).json({ error: 'Only server owner can create roles' });
  }
  
  const { data, error } = await supabase
    .from('server_roles')
    .insert({
      server_id: serverId,
      name,
      color: color || '#99AAB5',
      category,
      permissions: permissions || {},
      mentionable: mentionable || false,
      position: position || 0
    })
    .select()
    .single();
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Update role
router.patch('/servers/:serverId/roles/:roleId', authenticateToken, async (req, res) => {
  const { serverId, roleId } = req.params;
  const { name, color, category, permissions, mentionable, position } = req.body;
  
  const { data: server } = await supabase
    .from('servers')
    .select('owner_id')
    .eq('id', serverId)
    .single();
  
  if (!server || server.owner_id !== req.user.id) {
    return res.status(403).json({ error: 'Only server owner can update roles' });
  }
  
  const { data, error } = await supabase
    .from('server_roles')
    .update({ name, color, category, permissions, mentionable, position })
    .eq('id', roleId)
    .eq('server_id', serverId)
    .select()
    .single();
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Delete role
router.delete('/servers/:serverId/roles/:roleId', authenticateToken, async (req, res) => {
  const { serverId, roleId } = req.params;
  
  const { data: server } = await supabase
    .from('servers')
    .select('owner_id')
    .eq('id', serverId)
    .single();
  
  if (!server || server.owner_id !== req.user.id) {
    return res.status(403).json({ error: 'Only server owner can delete roles' });
  }
  
  const { error } = await supabase
    .from('server_roles')
    .delete()
    .eq('id', roleId)
    .eq('server_id', serverId);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Get member's roles
router.get('/servers/:serverId/members/:memberId/roles', authenticateToken, async (req, res) => {
  const { serverId, memberId } = req.params;
  
  const { data, error } = await supabase
    .from('member_roles')
    .select('*, role:server_roles(*)')
    .eq('server_id', serverId)
    .eq('user_id', memberId);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Assign role to member
router.post('/servers/:serverId/members/:memberId/roles', authenticateToken, async (req, res) => {
  const { serverId, memberId } = req.params;
  const { roleId } = req.body;
  
  const { data: server } = await supabase
    .from('servers')
    .select('owner_id')
    .eq('id', serverId)
    .single();
  
  if (!server || server.owner_id !== req.user.id) {
    return res.status(403).json({ error: 'Only server owner can assign roles' });
  }
  
  const { data, error } = await supabase
    .from('member_roles')
    .insert({
      server_id: serverId,
      user_id: memberId,
      role_id: roleId,
      assigned_by: req.user.id
    })
    .select('*, role:server_roles(*)')
    .single();
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Remove role from member
router.delete('/servers/:serverId/members/:memberId/roles/:roleId', authenticateToken, async (req, res) => {
  const { serverId, memberId, roleId } = req.params;
  
  const { data: server } = await supabase
    .from('servers')
    .select('owner_id')
    .eq('id', serverId)
    .single();
  
  if (!server || server.owner_id !== req.user.id) {
    return res.status(403).json({ error: 'Only server owner can remove roles' });
  }
  
  const { error } = await supabase
    .from('member_roles')
    .delete()
    .eq('server_id', serverId)
    .eq('user_id', memberId)
    .eq('role_id', roleId);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Get all server members
router.get('/servers/:serverId/members', authenticateToken, async (req, res) => {
  const { serverId } = req.params;
  
  const { data, error } = await supabase
    .from('server_members')
    .select(`
      *,
      user:profiles(*),
      roles:member_roles(*, role:server_roles(*))
    `)
    .eq('server_id', serverId);
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Update member
router.patch('/servers/:serverId/members/:memberId', authenticateToken, async (req, res) => {
  const { serverId, memberId } = req.params;
  const { nickname } = req.body;
  
  const { data: server } = await supabase
    .from('servers')
    .select('owner_id')
    .eq('id', serverId)
    .single();
  
  if (!server || server.owner_id !== req.user.id) {
    return res.status(403).json({ error: 'Only server owner can update members' });
  }
  
  const { data, error } = await supabase
    .from('server_members')
    .update({ nickname })
    .eq('server_id', serverId)
    .eq('user_id', memberId)
    .select()
    .single();
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
