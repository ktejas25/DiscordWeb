import React from 'react';
import { Volume2, LogIn, LogOut } from 'lucide-react';
import { ParticipantRow } from './ParticipantRow';
import { Participant } from '@/types/voice';

interface VoiceChannelItemProps {
  channelId: string;
  channelName: string;
  isJoined: boolean;
  participants: Participant[];
  onJoin: () => void;
  onLeave: () => void;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  userId?: string;
}

export function VoiceChannelItem({
  channelId,
  channelName,
  isJoined,
  participants,
  onJoin,
  onLeave,
  onToggleMute,
  onToggleDeafen,
  userId
}: VoiceChannelItemProps) {
  return (
    <div className="space-y-1">
      <div 
        onClick={isJoined ? onLeave : onJoin}
        className="flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors text-discord-muted hover:bg-discord-dark/50 hover:text-white group"
      >
        <Volume2 className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 truncate text-sm font-medium">{channelName}</span>
        <div className="p-1">
          {isJoined ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
        </div>
      </div>

      {participants.length > 0 && (
        <div className="ml-2 space-y-0.5">
          {participants.map(participant => (
            <ParticipantRow
              key={participant.userId}
              participant={participant}
              onToggleMute={participant.userId === userId ? onToggleMute : undefined}
              onToggleDeafen={participant.userId === userId ? onToggleDeafen : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
