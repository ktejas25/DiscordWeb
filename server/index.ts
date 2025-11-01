import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import { createServer as createHttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { handleDemo } from "./routes/demo";
import { handleRegister, handleLogin, handleLogout, handleGetMe } from "./routes/auth";
import { handleGetVoiceToken } from "./routes/voice";
import { authenticateToken, errorHandler } from "./middleware/auth";
import {
  handleSendInvitation,
  handleGetPendingInvitations,
  handleAcceptInvitation,
  handleDeclineInvitation,
  handleGetChannelMembers,
  handleRemoveMember,
  handleLeaveChannel,
  handleGetChannelMessages,
  handleSendChannelMessage
} from "./routes/channels";
import { setupSocketHandlers } from "./sockets/handlers";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Auth Routes (public)
  app.post("/auth/register", handleRegister);
  app.post("/auth/login", handleLogin);
  app.post("/auth/logout", handleLogout);

  // Protected Routes
  app.get("/auth/me", authenticateToken, handleGetMe);
  app.post("/api/voice/token", handleGetVoiceToken);

  // Channel Routes
  app.post("/channels/:channelId/invitations", authenticateToken, handleSendInvitation);
  app.get("/invitations/pending", authenticateToken, handleGetPendingInvitations);
  app.patch("/invitations/:invitationId/accept", authenticateToken, handleAcceptInvitation);
  app.patch("/invitations/:invitationId/decline", authenticateToken, handleDeclineInvitation);
  app.get("/channels/:channelId/members", authenticateToken, handleGetChannelMembers);
  app.delete("/channels/:channelId/members/:userId", authenticateToken, handleRemoveMember);
  app.post("/channels/:channelId/leave", authenticateToken, handleLeaveChannel);
  app.get("/channels/:channelId/messages", authenticateToken, handleGetChannelMessages);
  app.post("/channels/:channelId/messages", authenticateToken, handleSendChannelMessage);
  
  console.log('✅ Channel routes registered');

  // Example API routes
  app.get("/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/demo", handleDemo);

  // Error handling middleware
  app.use(errorHandler);

  // Setup Socket.io (for development, it will be handled by Vite)
  // In production, Socket.io would be configured here
  if (process.env.NODE_ENV === "development") {
    const httpServer = createHttpServer(app);
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"]
      }
    });
    setupSocketHandlers(io);
    return httpServer;
  }

  return app;
}

// Only start standalone server in production
if (process.env.NODE_ENV !== "development") {
  const PORT = process.env.PORT || 8081;
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
