import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LanguagePage() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Language</h2>
        <p className="text-discord-muted">Select your preferred language</p>
      </div>

      <div>
        <Label className="text-white">Language</Label>
        <Select
          value={settings?.settings?.locale || 'en'}
          onValueChange={(v) => updateSettings({ locale: v })}
        >
          <SelectTrigger className="bg-discord-darker border-discord-dark text-white mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="ja">日本語</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
