import React from 'react';
import { useVoice } from '@/hooks/useVoice';
import { VoiceChannelItem } from './VoiceChannelItem';
import { SelfFooter } from './SelfFooter';
import { useAuth } from '@/contexts/AuthContext';

interface VoiceChannelsProps {
  serverId: string;
  channels: Array<{ id: string; name: string; type: string }>;
}

export function VoiceChannels({ serverId, channels }: VoiceChannelsProps) {
  const { user } = useAuth();
  const { voiceState, selfMuted, selfDeafened, joinVoice, leaveVoice, toggleMute, toggleDeafen } = useVoice();

  const voiceChannels = channels.filter(c => c.type === 'voice');

  if (voiceChannels.length === 0) return null;

  return (
    <>
      <div className="space-y-1">
        <div className="text-xs font-semibold text-discord-muted uppercase px-2 mb-1">Voice Channels</div>
        {voiceChannels.map((channel) => (
          <VoiceChannelItem
            key={channel.id}
            channelId={channel.id}
            channelName={channel.name}
            isJoined={voiceState[channel.id]?.isJoinedBySelf || false}
            participants={voiceState[channel.id]?.participants || []}
            onJoin={() => joinVoice(channel.id)}
            onLeave={leaveVoice}
            onToggleMute={toggleMute}
            onToggleDeafen={toggleDeafen}
            userId={user?.id}
          />
        ))}
      </div>
      <SelfFooter
        muted={selfMuted}
        deafened={selfDeafened}
        onToggleMute={toggleMute}
        onToggleDeafen={toggleDeafen}
      />
    </>
  );
}
