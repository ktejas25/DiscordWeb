export interface NormalizedUser {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatar?: string;
  provider: string;
}

export interface NormalizedMessage {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
  timestamp: Date;
  attachments?: Attachment[];
  reactions?: Reaction[];
}

export interface NormalizedChannel {
  id: string;
  name: string;
  type: 'dm' | 'group' | 'channel';
  memberCount?: number;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}

export interface Attachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  contentType?: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

export interface PaginatedMessages {
  messages: NormalizedMessage[];
  hasNext: boolean;
  cursor?: string;
}

export interface FetchOptions {
  limit?: number;
  before?: string;
  after?: string;
}

export interface MessageContent {
  text: string;
  attachments?: Attachment[];
}
