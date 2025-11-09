import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export interface UserSettings {
  user_id: string;
  settings: {
    theme?: string;
    locale?: string;
    reducedMotion?: boolean;
    notifications?: any;
    privacy?: any;
    appearance?: any;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

const defaultSettings = {
  theme: 'system',
  locale: 'en',
  fontSize: 'medium',
  reducedMotion: false,
  notifications: { enableSounds: true, desktopPush: false },
  privacy: { allowDMsFromServerMembers: true, allowFriendRequests: true },
  textImages: { linkPreviews: true, showEmoji: true },
  voice: { inputVolume: 100, inputDevice: 'default', outputDevice: 'default' },
  advanced: { developerMode: false, debugLogs: false },
  keybinds: { pushToTalk: '', toggleMute: '' }
};

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSettings(null);
      setLoading(false);
      return;
    }
    fetchSettings();
  }, [user]);

  async function fetchSettings() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { data: newSettings, error: insertError } = await supabase
          .from('user_settings')
          .insert({ user_id: user!.id, settings: defaultSettings })
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newSettings);
      } else {
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateSettings(updates: any) {
    try {
      const newSettings = { ...settings?.settings, ...updates };
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({ user_id: user!.id, settings: newSettings })
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
      return data;
    } catch (err) {
      throw err;
    }
  }

  return { settings, loading, updateSettings, refetch: fetchSettings };
}
