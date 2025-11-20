import { config } from '../config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMetadata {
  [key: string]: any;
}

const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'authorization', 'cookie'];

function redactSensitive(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  const redacted = Array.isArray(obj) ? [...obj] : { ...obj };
  
  for (const key in redacted) {
    if (SENSITIVE_FIELDS.some(field => key.toLowerCase().includes(field))) {
      redacted[key] = '[REDACTED]';
    } else if (typeof redacted[key] === 'object') {
      redacted[key] = redactSensitive(redacted[key]);
    }
  }
  
  return redacted;
}

function formatLog(level: LogLevel, message: string, metadata?: LogMetadata) {
  const timestamp = new Date().toISOString();
  
  if (config.server.nodeEnv === 'production') {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...redactSensitive(metadata || {}),
    });
  }
  
  const meta = metadata ? ` ${JSON.stringify(redactSensitive(metadata))}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${meta}`;
}

export const logger = {
  debug(message: string, metadata?: LogMetadata) {
    if (config.monitoring.logLevel === 'debug') {
      console.log(formatLog('debug', message, metadata));
    }
  },
  
  info(message: string, metadata?: LogMetadata) {
    console.log(formatLog('info', message, metadata));
  },
  
  warn(message: string, metadata?: LogMetadata) {
    console.warn(formatLog('warn', message, metadata));
  },
  
  error(message: string, metadata?: LogMetadata) {
    console.error(formatLog('error', message, metadata));
  },
};
