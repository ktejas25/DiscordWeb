import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function AccessibilityPage() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Accessibility</h2>
        <p className="text-discord-muted">Configure accessibility options</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Reduced Motion</Label>
            <p className="text-sm text-discord-muted">Reduce animations</p>
          </div>
          <Switch
            checked={settings?.settings?.reducedMotion ?? false}
            onCheckedChange={(v) => updateSettings({ reducedMotion: v })}
          />
        </div>
      </div>
    </div>
  );
}
