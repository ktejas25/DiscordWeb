import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Participant } from '@/types/voice';

interface ParticipantRowProps {
  participant: Participant;
  onToggleMute?: () => void;
  onToggleDeafen?: () => void;
}

export function ParticipantRow({ participant, onToggleMute, onToggleDeafen }: ParticipantRowProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-discord-dark/30 rounded">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
        participant.speaking ? 'ring-2 ring-green-500 speaking-indicator' : ''
      } ${participant.avatarUrl ? '' : 'bg-primary/20 text-primary'}`}>
        {participant.avatarUrl ? (
          <img src={participant.avatarUrl} alt={participant.username} className="w-full h-full rounded-full" />
        ) : (
          participant.username.charAt(0).toUpperCase()
        )}
      </div>

      <span className="flex-1 text-sm text-discord-muted truncate">{participant.username}</span>

      <div className="flex gap-1">
        {participant.isSelf && onToggleMute && onToggleDeafen ? (
          <>
            <button
              onClick={onToggleMute}
              aria-label={participant.muted ? 'Unmute' : 'Mute'}
              className={`p-1 rounded transition hover:bg-discord-dark cursor-pointer ${
                participant.muted ? 'text-red-500' : 'text-discord-muted'
              }`}
            >
              {participant.muted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onToggleDeafen}
              aria-label={participant.deafened ? 'Undeafen' : 'Deafen'}
              className={`p-1 rounded transition hover:bg-discord-dark cursor-pointer ${
                participant.deafened ? 'text-red-500' : 'text-discord-muted'
              }`}
            >
              {participant.deafened ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </>
        ) : (
          <>
            <div className={`p-1 ${participant.muted ? 'text-red-500' : 'text-discord-muted'}`}>
              {participant.muted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </div>
            <div className={`p-1 ${participant.deafened ? 'text-red-500' : 'text-discord-muted'}`}>
              {participant.deafened ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
