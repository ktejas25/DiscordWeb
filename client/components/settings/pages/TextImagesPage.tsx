import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function TextImagesPage() {
  const { settings, updateSettings } = useSettings();

  const handleToggle = async (key: string, value: boolean) => {
    const textImages = { ...settings?.settings?.textImages, [key]: value };
    await updateSettings({ textImages });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Text & Images</h2>
        <p className="text-discord-muted">Configure text and image display</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Show Link Previews</Label>
            <p className="text-sm text-discord-muted">Display previews for links</p>
          </div>
          <Switch
            checked={settings?.settings?.textImages?.linkPreviews ?? true}
            onCheckedChange={(v) => handleToggle('linkPreviews', v)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Show Emoji</Label>
            <p className="text-sm text-discord-muted">Display emoji in messages</p>
          </div>
          <Switch
            checked={settings?.settings?.textImages?.showEmoji ?? true}
            onCheckedChange={(v) => handleToggle('showEmoji', v)}
          />
        </div>
      </div>
    </div>
  );
}
