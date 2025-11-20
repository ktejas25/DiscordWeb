import { validateEnv, ValidatedEnv } from './env-validator';

let env: ValidatedEnv;

try {
  env = validateEnv();
} catch (error) {
  console.error('❌ Configuration Error:', error instanceof Error ? error.message : error);
  process.exit(1);
}

export const config = {
  server: {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    corsOrigins: env.FRONTEND_URL ? [env.FRONTEND_URL] : ['*'],
  },
  
  database: {
    url: env.SUPABASE_URL,
    serviceKey: env.SUPABASE_SERVICE_KEY,
    anonKey: env.VITE_SUPABASE_ANON_KEY,
  },
  
  auth: {
    jwtSecret: env.JWT_SECRET,
    sessionSecret: env.SESSION_SECRET,
    tokenExpiry: '7d',
  },
  
  providers: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      redirectUri: env.DISCORD_REDIRECT_URI,
      scopes: ['identify', 'email', 'guilds'],
      enabled: !!(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET),
    },
    slack: {
      clientId: env.SLACK_CLIENT_ID,
      clientSecret: env.SLACK_CLIENT_SECRET,
      redirectUri: env.SLACK_REDIRECT_URI,
      scopes: ['users:read', 'channels:read', 'chat:write'],
      enabled: !!(env.SLACK_CLIENT_ID && env.SLACK_CLIENT_SECRET),
    },
    telegram: {
      botToken: env.TELEGRAM_BOT_TOKEN,
      enabled: !!env.TELEGRAM_BOT_TOKEN,
    },
  },
  
  monitoring: {
    sentryDsn: env.SENTRY_DSN,
    logLevel: env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
  
  cache: {
    redisUrl: env.REDIS_URL,
    ttl: 300, // 5 minutes
  },
  
  voice: {
    livekitUrl: env.LIVEKIT_URL,
    livekitApiKey: env.LIVEKIT_API_KEY,
    livekitApiSecret: env.LIVEKIT_API_SECRET,
  },
} as const;
