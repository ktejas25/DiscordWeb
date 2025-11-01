import { socketService } from './socketService';
import { Participant } from '@/types/voice';

export class PresenceClient {
  private heartbeatInterval: NodeJS.Timeout | null = null;

  subscribe() {
    try {
      const socket = socketService.getSocket();
      if (!socket) return;

      socket.on('voice:userlist', this.handleUserList);
      socket.on('voice:join', this.handleUserJoin);
      socket.on('voice:leave', this.handleUserLeave);
      socket.on('voice:state', this.handleStateUpdate);
      socket.on('voice:speaking', this.handleSpeaking);
    } catch (error) {
      console.warn('Voice presence unavailable:', error);
    }
  }

  unsubscribe() {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.off('voice:userlist', this.handleUserList);
    socket.off('voice:join', this.handleUserJoin);
    socket.off('voice:leave', this.handleUserLeave);
    socket.off('voice:state', this.handleStateUpdate);
    socket.off('voice:speaking', this.handleSpeaking);

    this.stopHeartbeat();
  }

  joinVoice(channelId: string, user: { id: string; username: string; avatarUrl?: string }) {
    try {
      socketService.emit('voice:join', { channelId, user });
      this.startHeartbeat(channelId, user.id);
    } catch (error) {
      console.warn('Failed to join voice:', error);
    }
  }

  leaveVoice(channelId: string, userId: string) {
    try {
      socketService.emit('voice:leave', { channelId, userId });
      this.stopHeartbeat();
    } catch (error) {
      console.warn('Failed to leave voice:', error);
    }
  }

  updateState(channelId: string, userId: string, muted: boolean, deafened: boolean) {
    socketService.emit('voice:state', { channelId, userId, muted, deafened });
  }

  updateSpeaking(channelId: string, userId: string, speaking: boolean) {
    socketService.emit('voice:speaking', { channelId, userId, speaking });
  }

  private startHeartbeat(channelId: string, userId: string) {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      socketService.emit('voice:heartbeat', { channelId, userId });
    }, 15000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleUserList = (data: { channelId: string; participants: Participant[] }) => {
    window.dispatchEvent(new CustomEvent('voice:userlist', { detail: data }));
  };

  private handleUserJoin = (data: { channelId: string; user: Participant }) => {
    window.dispatchEvent(new CustomEvent('voice:join', { detail: data }));
  };

  private handleUserLeave = (data: { channelId: string; userId: string }) => {
    window.dispatchEvent(new CustomEvent('voice:leave', { detail: data }));
  };

  private handleStateUpdate = (data: { channelId: string; userId: string; muted: boolean; deafened: boolean }) => {
    window.dispatchEvent(new CustomEvent('voice:state', { detail: data }));
  };

  private handleSpeaking = (data: { channelId: string; userId: string; speaking: boolean }) => {
    window.dispatchEvent(new CustomEvent('voice:speaking', { detail: data }));
  };
}

export const presenceClient = new PresenceClient();
