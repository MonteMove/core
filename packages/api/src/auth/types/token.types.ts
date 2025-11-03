import { UserPayload } from './user.types';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload extends UserPayload {
  sub: string;
  username: string;
  jti: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  id: string;
  jti: string;
  sessionJti: string;
  type: 'refresh';
  iat: number;
  exp: number;
}
