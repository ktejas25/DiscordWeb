import { RequestHandler, Request, Response, NextFunction } from "express";
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AppError, UnauthorizedError } from '../utils/errors';

const supabase = createClient(
  config.database.url,
  config.database.serviceKey
);

export const authenticateToken: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new UnauthorizedError('No token provided'));
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return next(new UnauthorizedError('Invalid token'));
    }
    (req as any).user = user;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
};

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : 'INTERNAL_ERROR';
  const message = err.message || 'Internal server error';
  
  logger.error('Request error', {
    statusCode,
    code,
    message,
    path: req.path,
    method: req.method,
    stack: config.server.nodeEnv === 'development' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    error: {
      code,
      message,
      details: isAppError ? (err as AppError).details : undefined,
    },
  });
};
