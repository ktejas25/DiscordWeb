import React from 'react';
import { useVoice } from '@/hooks/useVoice';
import { Participant } from '@/types/voice';
import { VoiceChannelItem } from './VoiceChannelItem';
import { SelfFooter } from './SelfFooter';
import { useAuth } from '@/contexts/AuthContext';

interface VoiceChannelsProps {
  serverId: string;
  channels: Array<{ id: string; name: string; type: string }>;
}

export function VoiceChannels({ serverId, channels }: VoiceChannelsProps) {
  const { user } = useAuth();
  const { voiceState, currentChannelId, selfMuted, selfDeafened, joinVoice, leaveVoice, toggleMute, toggleDeafen } = useVoice();

  const voiceChannels = channels.filter(c => c.type === 'voice');

  if (voiceChannels.length === 0) return null;

  return (
    <div className="space-y-1">
      <div className="text-xs font-semibold text-discord-muted uppercase px-2 mb-1">Voice Channels</div>
      {voiceChannels.map((channel) => {
        const isJoined = channel.id === currentChannelId;
        let participants = voiceState[channel.id]?.participants || [];
        
        if (isJoined && user) {
          participants = participants.map(p => 
            p.userId === user.id ? { ...p, muted: selfMuted, deafened: selfDeafened, isSelf: true } : p
          );
          
          if (!participants.some(p => p.userId === user.id)) {
            participants = [...participants, {
              userId: user.id,
              username: user.username,
              avatarUrl: user.avatar_url,
              muted: selfMuted,
              deafened: selfDeafened,
              speaking: false,
              isSelf: true
            }];
          }
        }
        
        return (
          <VoiceChannelItem
            key={channel.id}
            channelId={channel.id}
            channelName={channel.name}
            isJoined={isJoined}
            participants={participants}
            onJoin={() => joinVoice(channel.id)}
            onLeave={leaveVoice}
            onToggleMute={toggleMute}
            onToggleDeafen={toggleDeafen}
            userId={user?.id}
          />
        );
      })}
    </div>
  );
}
