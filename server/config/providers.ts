import { config } from './index';
import { IAuthAdapter } from '../adapters/base/IAuthAdapter';
import { IMessageAdapter } from '../adapters/base/IMessageAdapter';

export interface ProviderMetadata {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  enabled: boolean;
  authAdapter?: new () => IAuthAdapter;
  messageAdapter?: new () => IMessageAdapter;
}

export const providers: Record<string, ProviderMetadata> = {
  discord: {
    name: 'discord',
    displayName: 'Discord',
    icon: '/icons/discord.svg',
    color: '#5865F2',
    enabled: config.providers.discord.enabled,
  },
  slack: {
    name: 'slack',
    displayName: 'Slack',
    icon: '/icons/slack.svg',
    color: '#4A154B',
    enabled: config.providers.slack.enabled,
  },
  telegram: {
    name: 'telegram',
    displayName: 'Telegram',
    icon: '/icons/telegram.svg',
    color: '#0088CC',
    enabled: config.providers.telegram.enabled,
  },
};

export function getEnabledProviders(): ProviderMetadata[] {
  return Object.values(providers).filter(p => p.enabled);
}

export function getProvider(name: string): ProviderMetadata | undefined {
  return providers[name];
}
