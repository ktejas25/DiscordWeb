import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const socketService = {
  connect() {
    if (socket?.connected) return socket;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    socket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket() {
    return socket;
  },

  // Channel events
  joinChannel(channelId: string) {
    socket?.emit('channel:join', channelId);
  },

  leaveChannel(channelId: string) {
    socket?.emit('channel:leave', channelId);
  },

  onChannelMessage(callback: (message: any) => void) {
    socket?.on('message:new', callback);
  },

  onMessageUpdate(callback: (message: any) => void) {
    socket?.on('message:updated', callback);
  },

  onMessageDelete(callback: (messageId: string) => void) {
    socket?.on('message:deleted', callback);
  },

  // Typing indicators
  startTyping(channelId: string, userId: string, username: string) {
    socket?.emit('typing:start', channelId, userId, username);
  },

  stopTyping(channelId: string, userId: string) {
    socket?.emit('typing:stop', channelId, userId);
  },

  onUserTyping(callback: (data: any) => void) {
    socket?.on('typing:user', callback);
  },

  onUserStopTyping(callback: (data: any) => void) {
    socket?.on('typing:stop', callback);
  },

  // DM events
  joinDM(conversationId: string) {
    socket?.emit('dm:join', conversationId);
  },

  leaveDM(conversationId: string) {
    socket?.emit('dm:leave', conversationId);
  },

  onDMMessage(callback: (message: any) => void) {
    socket?.on('dm:new', callback);
  },

  onDMTyping(callback: (data: any) => void) {
    socket?.on('dm:typing:user', callback);
  },

  startDMTyping(conversationId: string, userId: string, username: string) {
    socket?.emit('dm:typing:start', conversationId, userId, username);
  },

  stopDMTyping(conversationId: string, userId: string) {
    socket?.emit('dm:typing:stop', conversationId, userId);
  },

  // User status
  updateUserStatus(userId: string, status: 'online' | 'idle' | 'dnd' | 'offline') {
    socket?.emit('user:status:change', userId, status);
  },

  onUserStatusUpdate(callback: (data: any) => void) {
    socket?.on('user:status:update', callback);
  },

  // Channel invitations
  onChannelInvitation(userId: string, callback: (data: any) => void) {
    socket?.on(`invitation:${userId}`, callback);
  },

  sendChannelMessage(channelId: string, message: any) {
    socket?.emit('channel:message', { channelId, message });
  },

  onChannelMessageReceived(callback: (message: any) => void) {
    socket?.on('channel:message', callback);
  },

  startChannelTyping(channelId: string, userId: string, username: string) {
    socket?.emit('channel:typing', { channelId, userId, username });
  },

  stopChannelTyping(channelId: string, userId: string) {
    socket?.emit('channel:typing:stop', { channelId, userId });
  },

  onChannelTyping(callback: (data: any) => void) {
    socket?.on('channel:typing', callback);
  },

  onChannelTypingStop(callback: (data: any) => void) {
    socket?.on('channel:typing:stop', callback);
  },

  onMemberJoined(callback: (data: any) => void) {
    socket?.on('member:joined', callback);
  },

  onMemberLeft(callback: (data: any) => void) {
    socket?.on('member:left', callback);
  },

  // Generic listeners
  on(event: string, callback: any) {
    socket?.on(event, callback);
  },

  off(event: string, callback: any) {
    socket?.off(event, callback);
  },

  emit(event: string, ...args: any[]) {
    socket?.emit(event, ...args);
  }
};
