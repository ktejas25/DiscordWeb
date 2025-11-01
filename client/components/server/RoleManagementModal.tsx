import React, { useState, useEffect } from 'react';
import { roleService } from '@/services/roleService';
import { ServerRole, RolePermissions } from '@/types/role';
import { X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface RoleManagementModalProps {
  serverId: string;
  onClose: () => void;
}

const PERMISSION_LABELS: Record<keyof RolePermissions, string> = {
  administrator: 'Administrator',
  manage_server: 'Manage Server',
  manage_roles: 'Manage Roles',
  manage_channels: 'Manage Channels',
  kick_members: 'Kick Members',
  ban_members: 'Ban Members',
  timeout_members: 'Timeout Members',
  mute_members: 'Mute Members',
  manage_messages: 'Manage Messages',
  manage_nicknames: 'Manage Nicknames',
  send_messages: 'Send Messages',
  create_invites: 'Create Invites',
  change_nickname: 'Change Nickname',
  mention_everyone: 'Mention Everyone',
  speak: 'Speak',
  video: 'Video',
  mentionable: 'Mentionable'
};

export function RoleManagementModal({ serverId, onClose }: RoleManagementModalProps) {
  const [roles, setRoles] = useState<ServerRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<ServerRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#99AAB5',
    category: 'Community',
    mentionable: false,
    permissions: {} as RolePermissions
  });

  useEffect(() => {
    loadRoles();
  }, [serverId]);

  const loadRoles = async () => {
    const data = await roleService.getServerRoles(serverId);
    console.log('📋 Available roles for assignment:', data);
    setRoles(data);
  };

  const handleCreate = async () => {
    try {
      console.log('✨ Creating new role:', formData);
      await roleService.createRole(serverId, formData);
      console.log('✅ Role created successfully');
      toast.success('Role created');
      loadRoles();
      resetForm();
    } catch (error) {
      console.error('❌ Failed to create role:', error);
      toast.error('Failed to create role');
    }
  };

  const handleUpdate = async () => {
    if (!selectedRole) return;
    try {
      await roleService.updateRole(selectedRole.id, formData);
      toast.success('Role updated');
      loadRoles();
      resetForm();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (roleId: string) => {
    if (!confirm('Delete this role?')) return;
    try {
      await roleService.deleteRole(roleId);
      toast.success('Role deleted');
      loadRoles();
    } catch (error) {
      toast.error('Failed to delete role');
    }
  };

  const resetForm = () => {
    setSelectedRole(null);
    setFormData({
      name: '',
      color: '#99AAB5',
      category: 'Community',
      mentionable: false,
      permissions: {}
    });
  };

  const selectRole = (role: ServerRole) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      color: role.color,
      category: role.category || 'Community',
      mentionable: role.mentionable,
      permissions: role.permissions
    });
  };

  const togglePermission = (key: keyof RolePermissions) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key]
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-discord-dark rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-discord-darker">
          <h2 className="text-xl font-semibold">Role Management</h2>
          <button onClick={onClose} className="text-discord-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r border-discord-darker p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-discord-muted mb-2">ROLES</h3>
            <div className="space-y-1">
              {roles.map(role => (
                <div
                  key={role.id}
                  onClick={() => selectRole(role)}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                    selectedRole?.id === role.id ? 'bg-discord-darker' : 'hover:bg-discord-darker/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                    <span className="text-sm" style={{ color: role.color }}>{role.name}</span>
                  </div>
                  {role.name !== '@everyone' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(role.id);
                      }}
                      className="text-discord-muted hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Role Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-discord-darker border border-discord-dark rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-20 h-10 bg-discord-darker border border-discord-dark rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-discord-darker border border-discord-dark rounded px-3 py-2"
                >
                  <option value="Admin">Admin</option>
                  <option value="Community">Community</option>
                  <option value="Interest">Interest</option>
                  <option value="Notification">Notification</option>
                  <option value="Aesthetic">Aesthetic</option>
                  <option value="Bot">Bot</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.mentionable}
                  onChange={(e) => setFormData({ ...formData, mentionable: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm">Allow anyone to @mention this role</label>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Permissions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!formData.permissions[key as keyof RolePermissions]}
                        onChange={() => togglePermission(key as keyof RolePermissions)}
                        className="w-4 h-4"
                      />
                      <label className="text-sm">{label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={selectedRole ? handleUpdate : handleCreate}
                  className="px-4 py-2 bg-primary hover:bg-primary/80 rounded font-medium"
                >
                  {selectedRole ? 'Update Role' : 'Create Role'}
                </button>
                {selectedRole && (
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 bg-discord-darker hover:bg-discord-dark rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
