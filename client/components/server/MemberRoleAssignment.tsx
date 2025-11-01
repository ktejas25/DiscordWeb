import React, { useEffect, useState } from 'react';
import { roleService } from '@/services/roleService';
import { ServerRole, MemberRole } from '@/types/role';
import { RoleBadge } from './RoleBadge';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface MemberRoleAssignmentProps {
  serverId: string;
  userId: string;
  username: string;
  isOwner: boolean;
  onClose: () => void;
}

export function MemberRoleAssignment({ serverId, userId, username, isOwner, onClose }: MemberRoleAssignmentProps) {
  const [allRoles, setAllRoles] = useState<ServerRole[]>([]);
  const [memberRoles, setMemberRoles] = useState<MemberRole[]>([]);

  useEffect(() => {
    loadData();
  }, [serverId, userId]);

  const loadData = async () => {
    const [roles, userRoles] = await Promise.all([
      roleService.getServerRoles(serverId),
      roleService.getMemberRoles(serverId, userId)
    ]);
    console.log('👥 Assigning roles to user:', username);
    console.log('📋 Available roles:', roles);
    console.log('✅ User current roles:', userRoles);
    setAllRoles(roles);
    setMemberRoles(userRoles);
  };

  const handleAssign = async (roleId: string) => {
    try {
      const role = allRoles.find(r => r.id === roleId);
      console.log(`➕ Assigning role "${role?.name}" to ${username}`);
      await roleService.assignRole(serverId, userId, roleId);
      console.log('✅ Role assigned successfully');
      await loadData();
      toast.success('Role assigned');
    } catch (error) {
      console.error('❌ Failed to assign role:', error);
      toast.error('Failed to assign role');
    }
  };

  const handleRemove = async (roleId: string) => {
    try {
      const role = allRoles.find(r => r.id === roleId);
      console.log(`➖ Removing role "${role?.name}" from ${username}`);
      await roleService.removeRole(serverId, userId, roleId);
      console.log('✅ Role removed successfully');
      await loadData();
      toast.success('Role removed');
    } catch (error) {
      console.error('❌ Failed to remove role:', error);
      toast.error('Failed to remove role');
    }
  };

  const hasRole = (roleId: string) => memberRoles.some(mr => mr.role_id === roleId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-discord-dark rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Manage Roles - {username}</h2>
          <button onClick={onClose} className="text-discord-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {allRoles.map(role => {
            const assigned = hasRole(role.id);
            return (
              <div key={role.id} className="flex items-center justify-between p-3 bg-discord-darker rounded hover:bg-discord-darker/80">
                <RoleBadge role={role} size="md" />
                {isOwner && (
                  <button
                    onClick={() => assigned ? handleRemove(role.id) : handleAssign(role.id)}
                    className={`px-3 py-1 rounded text-sm ${
                      assigned 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                        : 'bg-primary/20 text-primary hover:bg-primary/30'
                    }`}
                  >
                    {assigned ? 'Remove' : 'Assign'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
