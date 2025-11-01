import React, { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export function VoicePage() {
  const { settings, updateSettings } = useSettings();
  const [devices, setDevices] = useState<{ input: MediaDeviceInfo[], output: MediaDeviceInfo[] }>({ input: [], output: [] });

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(d => {
      setDevices({
        input: d.filter(dev => dev.kind === 'audioinput'),
        output: d.filter(dev => dev.kind === 'audiooutput')
      });
    });
  }, []);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Voice & Audio</h2>
        <p className="text-discord-muted">Configure voice and audio settings</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-white">Input Device</Label>
          <Select
            value={settings?.settings?.voice?.inputDevice || 'default'}
            onValueChange={(v) => updateSettings({ voice: { ...settings?.settings?.voice, inputDevice: v } })}
          >
            <SelectTrigger className="bg-discord-darker border-discord-dark text-white mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              {devices.input.map(d => <SelectItem key={d.deviceId} value={d.deviceId}>{d.label || 'Microphone'}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Output Device</Label>
          <Select
            value={settings?.settings?.voice?.outputDevice || 'default'}
            onValueChange={(v) => updateSettings({ voice: { ...settings?.settings?.voice, outputDevice: v } })}
          >
            <SelectTrigger className="bg-discord-darker border-discord-dark text-white mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              {devices.output.map(d => <SelectItem key={d.deviceId} value={d.deviceId}>{d.label || 'Speaker'}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Input Volume</Label>
          <Slider
            value={[settings?.settings?.voice?.inputVolume || 100]}
            onValueChange={([v]) => updateSettings({ voice: { ...settings?.settings?.voice, inputVolume: v } })}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}
