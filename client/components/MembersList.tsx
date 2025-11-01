import React, { useState, useEffect } from 'react';
import { serverService } from '@/services/serverService';
import { Users, Crown, Shield, Slash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface MembersListProps {
  serverId: string | null;
}

export function MembersList({ serverId }: MembersListProps) {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!serverId) {
      setMembers([]);
      setIsLoading(false);
      return;
    }

    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const data = await serverService.getServerMembers(serverId);
        setMembers(data);
      } catch (error) {
        toast.error('Failed to fetch members');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [serverId]);

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!serverId) return;
    if (confirm(`Remove ${memberName} from the server?`)) {
      try {
        await serverService.removeServerMember(serverId, memberId);
        setMembers(members.filter(m => m.user_id !== memberId));
        toast.success('Member removed');
      } catch (error) {
        toast.error('Failed to remove member');
      }
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!serverId) return;
    try {
      await serverService.updateServerMemberRole(serverId, userId, newRole);
      setMembers(members.map(m =>
        m.user_id === userId ? { ...m, role: newRole } : m
      ));
      toast.success('Role updated');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  if (!serverId) {
    return (
      <div className="w-64 bg-discord-darker border-l border-discord-darker p-4 text-center text-discord-muted text-sm">
        Select a server to view members
      </div>
    );
  }

  return (
    <div className="w-64 bg-discord-darker border-l border-discord-darker flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-discord-darker flex items-center gap-2">
        <Users className="w-4 h-4 text-discord-muted" />
        <h2 className="font-bold text-white">Members ({members.length})</h2>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading ? (
          <div className="text-center text-discord-muted py-8 text-sm">Loading...</div>
        ) : members.length === 0 ? (
          <div className="text-center text-discord-muted py-8 text-sm">No members</div>
        ) : (
          members.map((member) => {
            const getRoleIcon = (role: string) => {
              switch (role) {
                case 'owner':
                  return <Crown className="w-4 h-4" />;
                case 'admin':
                  return <Shield className="w-4 h-4" />;
                default:
                  return null;
              }
            };

            const getRoleColor = (role: string) => {
              switch (role) {
                case 'owner':
                  return 'text-yellow-400';
                case 'admin':
                  return 'text-blue-400';
                default:
                  return 'text-discord-muted';
              }
            };

            return (
              <div
                key={member.user_id}
                className="flex items-center justify-between p-2 rounded hover:bg-discord-dark/50 transition group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                    {member.user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {member.user?.display_name}
                    </p>
                    <p className={`text-xs flex items-center gap-1 ${getRoleColor(member.role)}`}>
                      {getRoleIcon(member.role)}
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  member.user?.status === 'online'
                    ? 'bg-green-500'
                    : member.user?.status === 'idle'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
