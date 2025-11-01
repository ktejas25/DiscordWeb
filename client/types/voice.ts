export interface Participant {
  userId: string;
  username: string;
  avatarUrl?: string;
  muted: boolean;
  deafened: boolean;
  speaking: boolean;
  isSelf?: boolean;
}

export interface VoiceChannelState {
  isJoinedBySelf: boolean;
  participants: Participant[];
}

export interface VoiceState {
  [channelId: string]: VoiceChannelState;
}
