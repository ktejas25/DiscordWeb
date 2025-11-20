export interface Provider {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  enabled: boolean;
}

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
  timestamp: string;
  attachments?: Attachment[];
}

export interface NormalizedChannel {
  id: string;
  name: string;
  type: 'dm' | 'group' | 'channel';
  memberCount?: number;
}

export interface Attachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  contentType?: string;
}
