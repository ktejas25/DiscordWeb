import React, { useEffect, useState } from 'react';
import { roleService } from '@/services/roleService';
import { RoleBadge } from './RoleBadge';
import { MemberRoleAssignment } from './MemberRoleAssignment';
import { Users, Settings } from 'lucide-react';

interface MembersListProps {
  serverId: string;
  isOwner: boolean;
}

export function MembersList({ serverId, isOwner }: MembersListProps) {
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  useEffect(() => {
    loadMembers();
  }, [serverId]);

  const loadMembers = async () => {
    const data = await roleService.getServerMembers(serverId);
    console.log('👥 Server members loaded:', data);
    console.log('💡 Click ⚙️ icon next to any member to assign roles');
    setMembers(data);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4 text-discord-muted">
        <Users className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase">Members — {members.length}</span>
      </div>
      
      <div className="space-y-2">
        {members.map(member => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-discord-darker rounded hover:bg-discord-dark">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                {member.user?.avatar_url ? (
                  <img src={member.user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold">{member.user?.username?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div 
                  className="font-medium truncate" 
                  style={{ color: member.roles?.[0]?.role?.color || '#FFFFFF' }}
                >
                  {member.nickname || member.user?.username}
                </div>
                <div className="text-xs text-discord-muted mt-0.5">
                  {member.roles?.map((mr: any, idx: number) => mr.role && (
                    <span key={mr.id}>
                      {idx > 0 && ', '}
                      <span style={{ color: mr.role.color }}>{mr.role.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {isOwner && (
              <button
                onClick={() => setSelectedMember(member)}
                className="text-discord-muted hover:text-white flex-shrink-0"
                title="Manage roles"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedMember && (
        <MemberRoleAssignment
          serverId={serverId}
          userId={selectedMember.user_id}
          username={selectedMember.user?.username}
          isOwner={isOwner}
          onClose={() => {
            setSelectedMember(null);
            loadMembers();
          }}
        />
      )}
    </div>
  );
}
