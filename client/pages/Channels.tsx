import React, { useState, useEffect } from 'react';
import { ServerSidebar } from '@/components/ServerSidebar';
import { ChannelsList } from '@/components/ChannelsList';
import { MessageList } from '@/components/MessageList';
import { DMList } from '@/components/DMList';
import { DMMessageList } from '@/components/DMMessageList';
import { MembersList } from '@/components/MembersList';
import { ChannelChat } from '@/components/channel/ChannelChat';
import { ChannelMembersList } from '@/components/channel/ChannelMembersList';
import { PendingInvitations } from '@/components/channel/PendingInvitations';
import { InviteMemberModal } from '@/components/channel/InviteMemberModal';
import { MembersList as ServerMembersList } from '@/components/server/MembersList';
import { RoleManagementModal } from '@/components/server/RoleManagementModal';
import { useDMs } from '@/hooks/useDMs';
import { useChannels } from '@/hooks/useChannels';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/services/supabaseClient';
import { MessageCircle, Users, UserPlus, Shield } from 'lucide-react';

export default function Channels() {
  const { user } = useAuth();
  const { conversations } = useDMs();
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [selectedChannelType, setSelectedChannelType] = useState<'text' | 'voice'>('text');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'servers' | 'dms'>('servers');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [showServerMembers, setShowServerMembers] = useState(false);
  const [isServerOwner, setIsServerOwner] = useState(false);
  const { channels } = useChannels(selectedServerId);

  useEffect(() => {
    if (selectedServerId && user) {
      checkServerOwner();
    }
  }, [selectedServerId, user]);

  const checkServerOwner = async () => {
    if (!selectedServerId || !user) return;
    const { data } = await supabase
      .from('servers')
      .select('owner_id')
      .eq('id', selectedServerId)
      .single();
    setIsServerOwner(data?.owner_id === user.id);
  };

  const handleTabChange = (tab: 'servers' | 'dms') => {
    setActiveTab(tab);
    if (tab === 'servers') {
      setSelectedConversationId(null);
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  const otherParticipant = selectedConversation?.participants?.find(
    (p: any) => p.user_id !== user?.id
  );
  const selectedChannel = channels.find(c => c.id === selectedChannelId);

  return (
    <div className="flex h-screen bg-discord-dark">
      {/* Server Icons Sidebar */}
      <ServerSidebar selectedServerId={selectedServerId} onServerSelect={setSelectedServerId} />

      {/* Channels / DMs Sidebar */}
      {activeTab === 'servers' ? (
        <ChannelsList
          serverId={selectedServerId}
          selectedChannelId={selectedChannelId}
          onChannelSelect={(id, type) => {
            setSelectedChannelId(id);
            setSelectedChannelType(type || 'text');
          }}
        />
      ) : (
        <DMList
          selectedConversationId={selectedConversationId}
          onConversationSelect={setSelectedConversationId}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-discord-darker border-b border-discord-darker flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {activeTab === 'servers' ? (
              <>
                <MessageCircle className="w-5 h-5 text-discord-muted" />
                <h1 className="text-white font-semibold">
                  {selectedChannelId && selectedChannel ? `# ${selectedChannel.name}` : 'Select a channel'}
                </h1>
                {selectedChannelId && selectedChannel && (
                  <>
                    <button
                      onClick={() => {
                        console.log('📨 Invite button clicked');
                        setInviteModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded text-sm font-medium"
                    >
                      <UserPlus className="w-4 h-4" />
                      Invite
                    </button>
                    {isServerOwner && (
                      <button
                        onClick={() => {
                          console.log('👥 Members button clicked - Opening server members list');
                          console.log('Server ID:', selectedServerId);
                          setShowServerMembers(!showServerMembers);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-discord-darker hover:bg-discord-dark text-white rounded text-sm font-medium border border-discord-dark"
                      >
                        <Users className="w-4 h-4" />
                        Members
                      </button>
                    )}
                    {isServerOwner && (
                      <button
                        onClick={() => {
                          console.log('🛡️ Roles button clicked - Opening role management');
                          console.log('Server ID:', selectedServerId);
                          setRoleModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-discord-darker hover:bg-discord-dark text-white rounded text-sm font-medium border border-discord-dark"
                      >
                        <Shield className="w-4 h-4" />
                        Roles
                      </button>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <Users className="w-5 h-5 text-discord-muted" />
                <h1 className="text-white font-semibold">
                  {selectedConversationId && otherParticipant?.profiles?.username
                    ? `@${otherParticipant.profiles.username}`
                    : 'Select a conversation'}
                </h1>
              </>
            )}
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => handleTabChange('servers')}
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === 'servers'
                  ? 'bg-primary text-white'
                  : 'text-discord-muted hover:text-white'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleTabChange('dms')}
              className={`px-4 py-2 rounded transition-colors ${
                activeTab === 'dms'
                  ? 'bg-primary text-white'
                  : 'text-discord-muted hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {activeTab === 'servers' ? (
              <>
                {selectedChannelId && selectedChannel ? (
                  <>
                    <ChannelChat channelId={selectedChannelId} channelName={selectedChannel.name} />
                    {showServerMembers && selectedServerId ? (
                      <ServerMembersList serverId={selectedServerId} isOwner={isServerOwner} />
                    ) : (
                      <ChannelMembersList channelId={selectedChannelId} isOwner={isServerOwner} serverId={selectedServerId || undefined} />
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-discord-muted">
                    Select a channel to start chatting
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                <PendingInvitations />
                <DMMessageList conversationId={selectedConversationId} />
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedChannelId && selectedChannel && (
        <InviteMemberModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          channelId={selectedChannelId}
          channelName={selectedChannel.name}
        />
      )}

      {roleModalOpen && selectedServerId && (
        <RoleManagementModal
          serverId={selectedServerId}
          onClose={() => setRoleModalOpen(false)}
        />
      )}
    </div>
  );
}
