import { supabase } from './supabaseClient';

export const settingsService = {
  async checkPrivacySetting(userId: string, setting: 'allowDMsFromServerMembers' | 'allowFriendRequests'): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', userId)
        .single();
      
      return data?.settings?.privacy?.[setting] ?? true;
    } catch {
      return true;
    }
  },

  async getNotificationSettings(userId: string) {
    try {
      const { data } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', userId)
        .single();
      
      return data?.settings?.notifications || { enableSounds: true, desktopPush: false };
    } catch {
      return { enableSounds: true, desktopPush: false };
    }
  },

  async getTextImagesSettings(userId: string) {
    try {
      const { data } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', userId)
        .single();
      
      return data?.settings?.textImages || { linkPreviews: true, showEmoji: true };
    } catch {
      return { linkPreviews: true, showEmoji: true };
    }
  },

  playNotificationSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXvzn0pBSh+zPDajzsKElyx6OyrWBUIQ5zd8sFuJAUuhM/z24k2CBhku+zooVARC0yl4fG5ZRwFNo3V7859KQUofsz');
    audio.play().catch(() => {});
  },

  showDesktopNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }
};
