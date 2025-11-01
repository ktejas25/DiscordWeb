import React, { useEffect, useState } from 'react';
import { roleService } from '@/services/roleService';
import { ServerRole } from '@/types/role';
import { RoleBadge } from './RoleBadge';
import { Shield, Plus } from 'lucide-react';

interface RolesListProps {
  serverId: string;
  onCreateRole?: () => void;
  isOwner?: boolean;
}

export function RolesList({ serverId, onCreateRole, isOwner }: RolesListProps) {
  const [roles, setRoles] = useState<ServerRole[]>([]);

  useEffect(() => {
    loadRoles();
  }, [serverId]);

  const loadRoles = async () => {
    const data = await roleService.getServerRoles(serverId);
    setRoles(data);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-discord-muted">
          <Shield className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase">Roles — {roles.length}</span>
        </div>
        {isOwner && (
          <button
            onClick={onCreateRole}
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Create
          </button>
        )}
      </div>
      <div className="space-y-1">
        {roles.map(role => (
          <div key={role.id} className="flex items-center justify-between p-2 hover:bg-discord-dark rounded">
            <RoleBadge role={role} size="md" />
            <span className="text-xs text-discord-muted">{role.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
