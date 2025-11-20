import { NormalizedMessage, NormalizedChannel, PaginatedMessages, FetchOptions, MessageContent } from './types';

export interface IMessageAdapter {
  sendMessage(destination: string, content: MessageContent, token: string): Promise<NormalizedMessage>;
  fetchMessages(channelId: string, options: FetchOptions, token: string): Promise<PaginatedMessages>;
  getChannels(token: string): Promise<NormalizedChannel[]>;
  addReaction(messageId: string, emoji: string, token: string): Promise<void>;
}
