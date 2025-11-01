import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "./index";
import express from "express";
import { createServer as createHttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { setupSocketHandlers } from "./sockets/handlers";

const port = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes from createServer
import { handleDemo } from "./routes/demo";
import { handleRegister, handleLogin, handleLogout, handleGetMe } from "./routes/auth";
import { handleGetVoiceToken } from "./routes/voice";
import { authenticateToken, errorHandler } from "./middleware/auth";

app.post("/auth/register", handleRegister);
app.post("/auth/login", handleLogin);
app.post("/auth/logout", handleLogout);
app.get("/auth/me", authenticateToken, handleGetMe);
app.post("/api/voice/token", handleGetVoiceToken);
app.get("/ping", (_req, res) => {
  const ping = process.env.PING_MESSAGE ?? "ping";
  res.json({ message: ping });
});
app.get("/demo", handleDemo);
app.use(errorHandler);

// In production, serve the built SPA files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "../spa");
app.use(express.static(distPath));

// Create HTTP server with Socket.IO
const httpServer = createHttpServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
setupSocketHandlers(io);

httpServer.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`🎙️ Voice: LiveKit Cloud`);
  console.log(`🔌 Socket.IO: Ready`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
