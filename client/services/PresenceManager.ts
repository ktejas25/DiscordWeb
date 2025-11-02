import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export type PresenceMeta = {
  serverId: string;
  userId: string;
  username: string;
  avatar_url?: string | null;
  activeTextChannelId: string | null;
  activeVoiceChannelId: string | null;
};

export class PresenceManager {
  private channel: RealtimeChannel | null = null;
  private currentMeta: PresenceMeta | null = null;
  private listeners: Set<() => void> = new Set();

  async subscribe(serverId: string, nonce: string, userId: string, username: string, avatar_url?: string | null) {
    if (this.channel) {
      await this.unsubscribe();
    }

    this.currentMeta = {
      serverId,
      userId,
      username,
      avatar_url,
      activeTextChannelId: null,
      activeVoiceChannelId: null,
    };

    this.channel = supabase.channel(`voice-presence:${serverId}:${nonce}`, {
      config: { presence: { key: userId } }
    });

    this.channel
      .on('presence', { event: 'sync' }, () => {
        this.notifyListeners();
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await this.channel?.track(this.currentMeta!);
        }
      });
  }

  async unsubscribe() {
    if (this.channel) {
      await this.channel.unsubscribe();
      this.channel = null;
    }
    this.currentMeta = null;
  }

  async setActiveText(channelId: string | null) {
    if (!this.currentMeta || !this.channel) return;
    this.currentMeta.activeTextChannelId = channelId;
    await this.channel.track(this.currentMeta);
  }

  async joinVoice(channelId: string) {
    if (!this.currentMeta || !this.channel) return;
    this.currentMeta.activeVoiceChannelId = channelId;
    await this.channel.track(this.currentMeta);
  }

  async leaveVoice() {
    if (!this.currentMeta || !this.channel) return;
    this.currentMeta.activeVoiceChannelId = null;
    await this.channel.track(this.currentMeta);
  }

  getGroupedPresence(): { textByChannel: Map<string, PresenceMeta[]>; voiceByChannel: Map<string, PresenceMeta[]> } {
    if (!this.channel) {
      return { textByChannel: new Map(), voiceByChannel: new Map() };
    }

    const state = this.channel.presenceState<PresenceMeta>();
    const textByChannel = new Map<string, PresenceMeta[]>();
    const voiceByChannel = new Map<string, PresenceMeta[]>();
    const seenUsers = new Map<string, PresenceMeta>();

    Object.values(state).forEach((presences) => {
      presences.forEach((meta) => {
        const existing = seenUsers.get(meta.userId);
        if (!existing || meta.activeVoiceChannelId) {
          seenUsers.set(meta.userId, meta);
        }
      });
    });

    seenUsers.forEach((meta) => {
      if (meta.activeVoiceChannelId) {
        const list = voiceByChannel.get(meta.activeVoiceChannelId) || [];
        list.push(meta);
        voiceByChannel.set(meta.activeVoiceChannelId, list);
      } else if (meta.activeTextChannelId) {
        const list = textByChannel.get(meta.activeTextChannelId) || [];
        list.push(meta);
        textByChannel.set(meta.activeTextChannelId, list);
      }
    });

    return { textByChannel, voiceByChannel };
  }

  onChange(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb());
  }
}

export const presenceManager = new PresenceManager();
