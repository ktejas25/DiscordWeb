import { NormalizedUser, TokenResponse } from './types';

export interface IAuthAdapter {
  getAuthorizationUrl(state: string): string;
  exchangeCode(code: string): Promise<TokenResponse>;
  refreshToken(refreshToken: string): Promise<TokenResponse>;
  getUser(accessToken: string): Promise<NormalizedUser>;
  revokeToken(token: string): Promise<void>;
}
