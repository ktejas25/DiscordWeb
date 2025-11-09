import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

export function NotificationsPage() {
  const { settings, updateSettings } = useSettings();

  const handleToggle = async (key: string, value: boolean) => {
    if (key === 'desktopPush' && value) {
      if (!('Notification' in window)) {
        toast({ title: 'Notifications not supported', description: 'Your browser does not support notifications.', variant: 'destructive' });
        return;
      }
      if (Notification.permission === 'denied') {
        toast({ title: 'Notifications blocked', description: 'Please enable notifications in your browser settings.', variant: 'destructive' });
        return;
      }
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          toast({ title: 'Permission denied', description: 'Notification permission was not granted.', variant: 'destructive' });
          return;
        }
      }
    }
    const notifications = { ...settings?.settings?.notifications, [key]: value };
    await updateSettings({ notifications });
    toast({ title: 'Settings updated', description: `${key === 'enableSounds' ? 'Sounds' : 'Desktop notifications'} ${value ? 'enabled' : 'disabled'}.` });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
        <p className="text-discord-muted">Configure notification preferences</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Enable Sounds</Label>
            <p className="text-sm text-discord-muted">Play notification sounds</p>
          </div>
          <Switch
            checked={settings?.settings?.notifications?.enableSounds ?? true}
            onCheckedChange={(v) => handleToggle('enableSounds', v)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-white">Desktop Push</Label>
            <p className="text-sm text-discord-muted">Show desktop notifications</p>
          </div>
          <Switch
            checked={settings?.settings?.notifications?.desktopPush ?? false}
            onCheckedChange={(v) => handleToggle('desktopPush', v)}
          />
        </div>
      </div>
    </div>
  );
}
