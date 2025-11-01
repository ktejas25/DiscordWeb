export interface RolePermissions {
  administrator?: boolean;
  manage_server?: boolean;
  manage_roles?: boolean;
  manage_channels?: boolean;
  kick_members?: boolean;
  ban_members?: boolean;
  timeout_members?: boolean;
  mute_members?: boolean;
  manage_messages?: boolean;
  manage_nicknames?: boolean;
  send_messages?: boolean;
  create_invites?: boolean;
  change_nickname?: boolean;
  mention_everyone?: boolean;
  speak?: boolean;
  video?: boolean;
  mentionable?: boolean;
}

export interface ServerRole {
  id: string;
  server_id: string;
  name: string;
  color: string;
  position: number;
  category?: string;
  permissions: RolePermissions;
  mentionable: boolean;
  created_at: string;
  updated_at: string;
}

export interface MemberRole {
  id: string;
  server_id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  assigned_by?: string;
  role?: ServerRole;
}
