import { Server, Socket } from 'socket.io';

interface VoiceParticipant {
  userId: string;
  username: string;
  avatarUrl?: string;
  muted: boolean;
  deafened: boolean;
  speaking: boolean;
  lastHeartbeat: number;
}

const voicePresence = new Map<string, Map<string, VoiceParticipant>>();

function cleanupStaleUsers() {
  const now = Date.now();
  const timeout = 30000; // 30 seconds

  voicePresence.forEach((participants, channelId) => {
    participants.forEach((participant, userId) => {
      if (now - participant.lastHeartbeat > timeout) {
        participants.delete(userId);
      }
    });
  });
}

setInterval(cleanupStaleUsers, 15000);

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Join rooms
    socket.on('channel:join', (channelId: string) => {
      socket.join(`channel:${channelId}`);
      console.log(`User ${socket.id} joined channel ${channelId}`);
    });

    socket.on('channel:leave', (channelId: string) => {
      socket.leave(`channel:${channelId}`);
      console.log(`User ${socket.id} left channel ${channelId}`);
    });

    socket.on('dm:join', (conversationId: string) => {
      socket.join(`dm:${conversationId}`);
      console.log(`User ${socket.id} joined DM ${conversationId}`);
    });

    socket.on('dm:leave', (conversationId: string) => {
      socket.leave(`dm:${conversationId}`);
      console.log(`User ${socket.id} left DM ${conversationId}`);
    });

    // Typing indicators
    socket.on('typing:start', (channelId: string, userId: string, username: string) => {
      socket.to(`channel:${channelId}`).emit('typing:user', {
        userId,
        username,
        channelId
      });
    });

    socket.on('typing:stop', (channelId: string, userId: string) => {
      socket.to(`channel:${channelId}`).emit('typing:stop', {
        userId,
        channelId
      });
    });

    // DM Typing
    socket.on('dm:typing:start', (conversationId: string, userId: string, username: string) => {
      socket.to(`dm:${conversationId}`).emit('dm:typing:user', {
        userId,
        username,
        conversationId
      });
    });

    socket.on('dm:typing:stop', (conversationId: string, userId: string) => {
      socket.to(`dm:${conversationId}`).emit('dm:typing:stop', {
        userId,
        conversationId
      });
    });

    // User status
    socket.on('user:status:change', (userId: string, status: 'online' | 'idle' | 'dnd' | 'offline') => {
      io.emit('user:status:update', {
        userId,
        status,
        timestamp: new Date().toISOString()
      });
    });

    // Voice presence
    socket.on('voice:join', (data: { channelId: string; user: { id: string; username: string; avatarUrl?: string } }) => {
      const { channelId, user } = data;
      
      if (!voicePresence.has(channelId)) {
        voicePresence.set(channelId, new Map());
      }

      const participant: VoiceParticipant = {
        userId: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        muted: false,
        deafened: false,
        speaking: false,
        lastHeartbeat: Date.now()
      };

      voicePresence.get(channelId)!.set(user.id, participant);

      io.emit('voice:join', { channelId, user: participant });
      
      const participants = Array.from(voicePresence.get(channelId)!.values());
      socket.emit('voice:userlist', { channelId, participants });
    });

    socket.on('voice:leave', (data: { channelId: string; userId: string }) => {
      const { channelId, userId } = data;
      
      if (voicePresence.has(channelId)) {
        voicePresence.get(channelId)!.delete(userId);
        io.emit('voice:leave', { channelId, userId });
      }
    });

    socket.on('voice:state', (data: { channelId: string; userId: string; muted: boolean; deafened: boolean }) => {
      const { channelId, userId, muted, deafened } = data;
      
      if (voicePresence.has(channelId)) {
        const participant = voicePresence.get(channelId)!.get(userId);
        if (participant) {
          participant.muted = muted;
          participant.deafened = deafened;
          participant.lastHeartbeat = Date.now();
          io.emit('voice:state', { channelId, userId, muted, deafened });
        }
      }
    });

    socket.on('voice:speaking', (data: { channelId: string; userId: string; speaking: boolean }) => {
      const { channelId, userId, speaking } = data;
      
      if (voicePresence.has(channelId)) {
        const participant = voicePresence.get(channelId)!.get(userId);
        if (participant) {
          participant.speaking = speaking;
          io.emit('voice:speaking', { channelId, userId, speaking });
        }
      }
    });

    socket.on('voice:heartbeat', (data: { channelId: string; userId: string }) => {
      const { channelId, userId } = data;
      
      if (voicePresence.has(channelId)) {
        const participant = voicePresence.get(channelId)!.get(userId);
        if (participant) {
          participant.lastHeartbeat = Date.now();
        }
      }
    });

    // Channel invitations
    socket.on('invitation:send', (data: { invitationId: string; invitee: any; channel: any }) => {
      io.emit(`invitation:${data.invitee.id}`, data);
    });

    // Channel messages
    socket.on('channel:message', (data: { channelId: string; message: any }) => {
      io.to(`channel:${data.channelId}`).emit('channel:message', data.message);
    });

    socket.on('channel:typing', (data: { channelId: string; userId: string; username: string }) => {
      socket.to(`channel:${data.channelId}`).emit('channel:typing', data);
    });

    socket.on('channel:typing:stop', (data: { channelId: string; userId: string }) => {
      socket.to(`channel:${data.channelId}`).emit('channel:typing:stop', data);
    });

    // Member events
    socket.on('member:joined', (data: { channelId: string; user: any }) => {
      io.to(`channel:${data.channelId}`).emit('member:joined', data);
    });

    socket.on('member:left', (data: { channelId: string; userId: string }) => {
      io.to(`channel:${data.channelId}`).emit('member:left', data);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
}
