import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyJwtToken } from "@/shared/lib/jwt-utils";
import { ROUTER_MAP } from "@/shared/utils/constants/router-map";
import {
  AUTH_REFRESH_TOKEN_COOKIE_KEY,
  AUTH_TOKEN_KEY,
} from "@/shared/utils/constants/storage-keys";

import { isDevelopment } from "./shared/lib/env-config";

/**
 * Middleware для проверки аутентификации
 * @param {NextRequest} request - HTTP запрос
 * @returns {Promise<NextResponse>} Редирект или продолжение
 * @description Dev: проверяет любой токен в cookies. Prod: JWT валидация refresh token
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;
  const isLoginRoute = pathname === ROUTER_MAP.LOGIN;

  if (isDevelopment) {
    const accessToken = request.cookies.get(AUTH_TOKEN_KEY)?.value;
    const refreshToken = request.cookies.get(AUTH_REFRESH_TOKEN_COOKIE_KEY)?.value;

    if (!accessToken && !refreshToken && !isLoginRoute) {
      const loginUrl = new URL(ROUTER_MAP.LOGIN, request.url);
      const nextPath = pathname + (search || "");

      if (nextPath && nextPath !== ROUTER_MAP.LOGIN) {
        loginUrl.searchParams.set("next", nextPath);
      }

      return NextResponse.redirect(loginUrl);
    }

    if ((accessToken || refreshToken) && isLoginRoute) {
      const dashboardUrl = new URL(ROUTER_MAP.DASHBOARD, request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  }

  const refreshToken = request.cookies.get(AUTH_REFRESH_TOKEN_COOKIE_KEY)?.value;
  const hasValidToken = refreshToken ? (await verifyJwtToken(refreshToken)) !== null : false;

  if (!hasValidToken && !isLoginRoute) {
    const loginUrl = new URL(ROUTER_MAP.LOGIN, request.url);
    const nextPath = pathname + (search || "");

    if (nextPath && nextPath !== ROUTER_MAP.LOGIN) {
      loginUrl.searchParams.set("next", nextPath);
    }

    const response = NextResponse.redirect(loginUrl);
    if (refreshToken) {
      response.cookies.delete(AUTH_REFRESH_TOKEN_COOKIE_KEY);
    }
    return response;
  }

  if (hasValidToken && isLoginRoute) {
    const dashboardUrl = new URL(ROUTER_MAP.DASHBOARD, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

/**
 * Конфигурация middleware
 * @property {string[]} matcher - Защищённые пути и login
 */
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
