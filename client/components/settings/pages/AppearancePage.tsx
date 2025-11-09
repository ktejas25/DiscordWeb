import React, { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AppearancePage() {
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    applyTheme(settings?.settings?.theme || 'system');
    applyFontSize(settings?.settings?.fontSize || 'medium');
  }, [settings?.settings?.theme, settings?.settings?.fontSize]);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
      root.classList.toggle('light', !isDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
      root.classList.toggle('light', theme === 'light');
    }
  };

  const applyFontSize = (size: string) => {
    const root = document.documentElement;
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    root.style.fontSize = sizes[size as keyof typeof sizes] || '16px';
  };

  const handleThemeChange = (theme: string) => {
    updateSettings({ theme });
    applyTheme(theme);
  };

  const handleFontSizeChange = (fontSize: string) => {
    updateSettings({ fontSize });
    applyFontSize(fontSize);
  };

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
            onValueChange={handleThemeChange}
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
            onValueChange={handleFontSizeChange}
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
