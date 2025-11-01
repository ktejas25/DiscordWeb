import { RequestHandler } from "express";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "@shared/api";

// Mock database for demonstration
const users: Map<string, any> = new Map();

// Mock token generation
const generateTokens = (userId: string) => {
  const accessToken = Buffer.from(JSON.stringify({ userId, type: "access" })).toString("base64");
  const refreshToken = Buffer.from(JSON.stringify({ userId, type: "refresh" })).toString("base64");
  return { accessToken, refreshToken };
};

export const handleRegister: RequestHandler = async (req, res) => {
  try {
    const { email, password, username, display_name } = req.body as RegisterRequest;

    // Validation
    if (!email || !password || !username || !display_name) {
      res.status(400).json({
        error: "Validation Error",
        message: "All fields are required",
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        error: "Validation Error",
        message: "Password must be at least 8 characters",
      });
      return;
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      res.status(400).json({
        error: "Validation Error",
        message: "Password must contain at least one uppercase letter",
      });
      return;
    }

    if (!/(?=.*\d)/.test(password)) {
      res.status(400).json({
        error: "Validation Error",
        message: "Password must contain at least one number",
      });
      return;
    }

    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      res.status(400).json({
        error: "Validation Error",
        message: "Password must contain at least one special character",
      });
      return;
    }

    // Check if user exists
    const existingUser = Array.from(users.values()).find(
      (u) => u.email === email || u.username === username
    );

    if (existingUser) {
      res.status(409).json({
        error: "Conflict",
        message: "Email or username already registered",
      });
      return;
    }

    // Create user
    const userId = `user_${Date.now()}`;
    const user: User = {
      id: userId,
      email,
      username,
      display_name,
      status: "online",
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.set(userId, { ...user, password }); // In production, hash the password!

    const { accessToken, refreshToken } = generateTokens(userId);

    const response: AuthResponse = {
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 604800, // 7 days
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to register user",
    });
  }
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      res.status(400).json({
        error: "Validation Error",
        message: "Email and password are required",
      });
      return;
    }

    const user = Array.from(users.values()).find((u) => u.email === email);

    if (!user || user.password !== password) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid email or password",
      });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        status: user.status,
        is_verified: user.is_verified,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 604800,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to login",
    });
  }
};

export const handleGetMe: RequestHandler = async (req, res) => {
  try {
    const token = (req as any).user?.token;

    if (!token) {
      res.status(401).json({
        error: "Unauthorized",
        message: "No token provided",
      });
      return;
    }

    // For now, return a mock user
    // In production, decode the token and get the actual user from database
    const mockUser: User = {
      id: "mock_user_1",
      email: "demo@example.com",
      username: "demouser",
      display_name: "Demo User",
      status: "online",
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    res.status(200).json(mockUser);
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to get user",
    });
  }
};

export const handleLogout: RequestHandler = async (req, res) => {
  try {
    // In a real app, you'd invalidate the token in the database
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to logout",
    });
  }
};
