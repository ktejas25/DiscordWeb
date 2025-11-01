import { RequestHandler } from "express";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const authenticateToken: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized", message: "No token provided" });
    return;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      res.status(403).json({ error: "Forbidden", message: "Invalid token" });
      return;
    }
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: "Forbidden", message: "Invalid token" });
  }
};

export const errorHandler: any = (err: any, req: any, res: any, next: any) => {
  console.error("Error:", err);

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    error: err.type || "Error",
    message,
    status,
  });
};
