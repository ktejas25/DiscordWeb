import React from 'react';
import { useSettings as useUserSettings } from '@/hooks/useSettings';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function PrivacyPage() {
  const { settings, updateSettings } = useUserSettings();

  const handleToggle = async (key: string, value: boolean) => {
    const privacy = { ...settings?.settings?.privacy, [key]: value };
    await updateSettings({ privacy });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Privacy & Safety</h2>
        <p className="text-discord-muted">Control who can interact with you</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Allow Direct Messages</Label>
            <p className="text-sm text-discord-muted">Let others send you DMs</p>
          </div>
          <Switch
            checked={settings?.settings?.privacy?.allowDMsFromServerMembers ?? true}
            onCheckedChange={(v) => handleToggle('allowDMsFromServerMembers', v)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Allow Friend Requests</Label>
            <p className="text-sm text-discord-muted">Let others send you friend requests</p>
          </div>
          <Switch
            checked={settings?.settings?.privacy?.showActivityStatus ?? true}
            onCheckedChange={(v) => handleToggle('showActivityStatus', v)}
          />
        </div>
      </div>
    </div>
  );
}
