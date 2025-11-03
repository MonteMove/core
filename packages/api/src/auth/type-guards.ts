import { isObject, isString } from 'class-validator';

import { JwtPayload, RefreshTokenPayload } from './types';

export function isJwtPayload(payload: unknown): payload is JwtPayload {
  if (!isObject(payload)) {
    return false;
  }

  const obj = payload as Record<string, unknown>;

  return (
    isString(obj.jti) &&
    isString(obj.id) &&
    isString(obj.username) &&
    Array.isArray(obj.roles)
  );
}

export function isRefreshTokenPayload(
  payload: unknown,
): payload is RefreshTokenPayload {
  if (!isObject(payload)) {
    return false;
  }

  const obj = payload as Record<string, unknown>;

  return (
    isString(obj.id) &&
    isString(obj.jti) &&
    isString(obj.sessionJti) &&
    obj.type === 'refresh'
  );
}
