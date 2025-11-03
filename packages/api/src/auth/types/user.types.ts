import { RoleCode } from '../../../prisma/generated/prisma';

export interface AuthUserResponse {
  id: string;
  username: string;
  telegramId: string | null;
  blocked: boolean;
  deleted: boolean;
  telegramNotifications: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  roles: Array<{
    id: string;
    code: RoleCode;
    name: string;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface UserPayload {
  id: string;
  username: string;
  roles: RoleCode[];
}

export interface SessionInfo {
  ip?: string;
  userAgent?: string;
}
