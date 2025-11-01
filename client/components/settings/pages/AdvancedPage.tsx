import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function AdvancedPage() {
  const { settings, updateSettings } = useSettings();

  const handleToggle = async (key: string, value: boolean) => {
    const advanced = { ...settings?.settings?.advanced, [key]: value };
    await updateSettings({ advanced });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Advanced</h2>
        <p className="text-discord-muted">Advanced settings for power users</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Developer Mode</Label>
            <p className="text-sm text-discord-muted">Enable developer features</p>
          </div>
          <Switch
            checked={settings?.settings?.advanced?.developerMode ?? false}
            onCheckedChange={(v) => handleToggle('developerMode', v)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Debug Logs</Label>
            <p className="text-sm text-discord-muted">Show debug information</p>
          </div>
          <Switch
            checked={settings?.settings?.advanced?.debugLogs ?? false}
            onCheckedChange={(v) => handleToggle('debugLogs', v)}
          />
        </div>
      </div>
    </div>
  );
}
