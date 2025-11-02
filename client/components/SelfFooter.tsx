import React from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettingsModal } from '@/contexts/SettingsContext';

interface SelfFooterProps {
  muted: boolean;
  deafened: boolean;
  speaking?: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
}

export function SelfFooter({ muted, deafened, speaking = false, onToggleMute, onToggleDeafen }: SelfFooterProps) {
  const { user } = useAuth();
  const { openSettings } = useSettingsModal(); // Hook must be at top level

  if (!user) return null;

  return (
    <div className="sticky bottom-0 bg-discord-darker border-t border-discord-dark p-2 flex items-center gap-2">
      <div className={`w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 overflow-hidden ${
        speaking ? 'ring-2 ring-green-500 speaking-indicator' : ''
      }`}>
        {user.avatar_url && user.avatar_url.trim() !== '' ? (
          <img src={user.avatar_url} alt={user.username} className="w-full h-full rounded-full object-cover" />
        ) : (
          user.username.charAt(0).toUpperCase()
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{user.username}</div>
        <div className="text-xs text-discord-muted">Online</div>
      </div>

      <div className="flex gap-1">
        <button
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className={`p-2 rounded hover:bg-discord-dark transition ${
            muted ? 'text-red-500' : 'text-discord-muted hover:text-white'
          }`}
        >
          {muted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <button
          onClick={onToggleDeafen}
          aria-label={deafened ? 'Undeafen' : 'Deafen'}
          className={`p-2 rounded hover:bg-discord-dark transition ${
            deafened ? 'text-red-500' : 'text-discord-muted hover:text-white'
          }`}
        >
          {deafened ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => {
            console.log('Settings button clicked'); // Add this for debugging
            openSettings();
          }}
          aria-label="Settings"
          className="p-2 rounded hover:bg-discord-dark text-discord-muted hover:text-white transition"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}