export interface DemoResponse {
  message: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  is_verified?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  display_name: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  status: number;
}

export interface Server {
  id: string;
  name: string;
  icon_url?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Channel {
  id: string;
  server_id: string;
  name: string;
  type: 'text' | 'voice';
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  channel_id: string;
  author_id: string;
  content: string;
  reply_to?: string;
  edited_at?: string;
  created_at: string;
}

export interface ChannelInvitation {
  id: string;
  channel_id: string;
  inviter_id: string;
  invitee_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
  channel?: Channel;
  inviter?: User;
}

export interface ChannelMember {
  id: string;
  channel_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  user?: User;
}
