import React, { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { toast } from 'sonner';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Espanol' },
  { code: 'fr', name: 'Francais' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Português' },
  { code: 'rs', name : 'Russian '},
  { code: 'cn', name: 'Chinese' },
  { code: 'jp', name: 'Japanese' },
];

export function LanguagePage() {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();
  const [selectedLocale, setSelectedLocale] = useState(settings?.settings?.locale || 'en');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.settings?.locale) {
      setSelectedLocale(settings.settings.locale);
    }
  }, [settings?.settings?.locale]);

  const hasChanges = selectedLocale !== (settings?.settings?.locale || 'en');

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({ locale: selectedLocale });
      toast.success('Language updated! Refreshing...');
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      toast.error('Failed to update language');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{t('Language')}</h2>
        <p className="text-discord-muted">Select your preferred language</p>
      </div>

      <div>
        <Label className="text-white">{t('Language')}</Label>
        <Select
          value={selectedLocale}
          onValueChange={setSelectedLocale}
        >
          <SelectTrigger className="bg-discord-darker border-discord-dark text-white mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 bg-primary hover:bg-primary/90"
          >
            {saving ? 'Saving...' : 'Save & Apply Language'}
          </Button>
        )}
      </div>
    </div>
  );
}
