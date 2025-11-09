import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function KeybindsPage() {
  const { settings, updateSettings } = useSettings();
  const [recording, setRecording] = useState<string | null>(null);
  const handlerRef = useRef<((e: KeyboardEvent) => void) | null>(null);

  useEffect(() => {
    return () => {
      if (handlerRef.current) {
        window.removeEventListener('keydown', handlerRef.current);
      }
    };
  }, []);

  const handleRecord = (key: string) => {
    if (handlerRef.current) {
      window.removeEventListener('keydown', handlerRef.current);
    }
    setRecording(key);
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === 'Escape') {
        setRecording(null);
        window.removeEventListener('keydown', handler);
        handlerRef.current = null;
        return;
      }
      const keybinds = { ...settings?.settings?.keybinds, [key]: e.code };
      updateSettings({ keybinds });
      setRecording(null);
      window.removeEventListener('keydown', handler);
      handlerRef.current = null;
    };
    handlerRef.current = handler;
    window.addEventListener('keydown', handler);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Keybinds</h2>
        <p className="text-discord-muted">Customize keyboard shortcuts</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Push to Talk</Label>
            <p className="text-sm text-discord-muted">{settings?.settings?.keybinds?.pushToTalk || 'Not set'}</p>
          </div>
          <Button
            onClick={() => handleRecord('pushToTalk')}
            variant="outline"
            className="bg-discord-darker border-discord-dark text-white hover:bg-discord-dark"
          >
            {recording === 'pushToTalk' ? 'Press any key...' : 'Record'}
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Toggle Mute</Label>
            <p className="text-sm text-discord-muted">{settings?.settings?.keybinds?.toggleMute || 'Not set'}</p>
          </div>
          <Button
            onClick={() => handleRecord('toggleMute')}
            variant="outline"
            className="bg-discord-darker border-discord-dark text-white hover:bg-discord-dark"
          >
            {recording === 'toggleMute' ? 'Press any key...' : 'Record'}
          </Button>
        </div>
      </div>
    </div>
  );
}
