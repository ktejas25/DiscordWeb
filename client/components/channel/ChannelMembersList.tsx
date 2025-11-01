import React, { useEffect, useState } from 'react';
import { channelService } from '@/services/channelService';
import { Users, Crown, UserMinus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ChannelMembersListProps {
  channelId: string;
  isOwner: boolean;
  serverId?: string;
}

export function ChannelMembersList({ channelId, isOwner, serverId }: ChannelMembersListProps) {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [serverAdmin, setServerAdmin] = useState<any>(null);

  useEffect(() => {
    loadMembers();
    if (serverId) loadServerAdmin();
  }, [channelId, serverId]);

  const loadMembers = async () => {
    const data = await channelService.getChannelMembers(channelId);
    console.log('Channel members loaded:', data);
    console.log('First member roles:', data[0]?.roles);
    console.log('First member role color:', data[0]?.roles?.[0]?.role?.color);
    setMembers(data);
  };

  const loadServerAdmin = async () => {
    if (!serverId) {
      console.log('No serverId provided');
      return;
    }
    console.log('Loading server admin for serverId:', serverId);
    try {
      const { supabase } = await import('@/services/supabaseClient');
      const { data, error } = await supabase
        .from('servers')
        .select('owner_id')
        .eq('id', serverId)
        .single();
      
      if (error) {
        console.error('Error fetching server:', error);
        return;
      }
      
      if (data?.owner_id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', data.owner_id)
          .single();
        console.log('Server admin loaded:', profile);
        setServerAdmin(profile);
      }
    } catch (error) {
      console.error('Failed to load server admin:', error);
    }
  };

  const handleRemove = async (userId: string, username: string) => {
    if (!confirm(`Remove @${username} from this channel?`)) return;
    try {
      await channelService.removeChannelMember(channelId, userId);
      setMembers(members.filter(m => m.user_id !== userId));
      toast.success('Member removed');
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  return (
    <div className="w-60 bg-discord-darker border-l border-discord-darker p-4">
      <div className="flex items-center gap-2 mb-4 text-discord-muted">
        <Users className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase">Members — {members.length}</span>
      </div>
      <div className="space-y-1">
        {serverAdmin && (
          <div className="flex items-center justify-between group hover:bg-discord-dark rounded px-2 py-1.5 transition mb-2 border-b border-discord-dark pb-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  {serverAdmin.avatar_url ? (
                    <img src={serverAdmin.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold text-yellow-500">{serverAdmin.username[0]?.toUpperCase()}</span>
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-discord-darker bg-gray-500" title="Offline" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-yellow-500 truncate">{serverAdmin.username}</span>
                  <Crown className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" aria-label="Server Owner" />
                </div>
                <span className="text-xs text-yellow-500/70">Server Owner</span>
              </div>
            </div>
          </div>
        )}
        {members.filter(member => !serverAdmin || member.user_id !== serverAdmin.id).map(member => {
          console.log('Rendering member:', member.user?.username, member);
          console.log('Member roles:', member.roles);
          console.log('First role:', member.roles?.[0]);
          console.log('Role color:', member.roles?.[0]?.role?.color);
          const status = member.user?.status || 'offline';
          const statusConfig = {
            online: { color: 'bg-green-500', label: 'Active' },
            idle: { color: 'bg-yellow-500', label: 'Idle' },
            dnd: { color: 'bg-red-500', label: 'Do Not Disturb' },
            offline: { color: 'bg-gray-500', label: 'Offline' }
          };
          const currentStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;
          const username = member.user?.username || 'Unknown User';
          const avatarUrl = member.user?.avatar_url;
          
          return (
            <div key={member.id} className="flex items-center justify-between group hover:bg-discord-dark rounded px-2 py-1.5 transition">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-sm font-semibold">{username[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div 
                    className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-discord-darker ${currentStatus.color}`}
                    title={currentStatus.label}
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className="text-sm font-medium truncate" 
                      style={{ color: member.roles?.[0]?.role?.color || '#FFFFFF' }}
                    >
                      {username}
                    </span>
                    {member.role === 'owner' && <Crown className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" aria-label="Channel Owner" />}
                    {serverAdmin && member.user_id === serverAdmin.id && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded font-semibold flex-shrink-0" title="Server Admin">ADMIN</span>
                    )}
                  </div>
                  <span className="text-xs">
                    {member.roles && member.roles.length > 0 ? (
                      member.roles.map((mr: any, idx: number) => mr.role ? (
                        <React.Fragment key={mr.id}>
                          {idx > 0 && ', '}
                          <span style={{ color: mr.role.color }}>{mr.role.name}</span>
                        </React.Fragment>
                      ) : null)
                    ) : (
                      <span className="text-discord-muted">{currentStatus.label}</span>
                    )}
                  </span>
                </div>
              </div>
              {isOwner && member.user_id !== user?.id && member.role !== 'owner' && (
                <button
                  onClick={() => handleRemove(member.user_id, member.user?.username)}
                  className="opacity-0 group-hover:opacity-100 text-discord-muted hover:text-red-500 transition flex-shrink-0"
                  title="Remove member"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
