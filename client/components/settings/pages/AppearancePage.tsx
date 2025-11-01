import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AppearancePage() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Appearance</h2>
        <p className="text-discord-muted">Customize the look and feel</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-white">Theme</Label>
          <Select
            value={settings?.settings?.theme || 'system'}
            onValueChange={(v) => updateSettings({ theme: v })}
          >
            <SelectTrigger className="bg-discord-darker border-discord-dark text-white mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Font Size</Label>
          <Select
            value={settings?.settings?.fontSize || 'medium'}
            onValueChange={(v) => updateSettings({ fontSize: v })}
          >
            <SelectTrigger className="bg-discord-darker border-discord-dark text-white mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
