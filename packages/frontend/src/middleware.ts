import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { env } from '@/shared/lib/env-config';
import { verifyJwtToken } from '@/shared/lib/jwt-utils';
import { ROUTER_MAP } from '@/shared/utils/constants/router-map';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;
  const isLoginRoute = pathname === ROUTER_MAP.LOGIN;

  return NextResponse.next();

  // let refreshToken = request.cookies.get(
  //   env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_COOKIE_KEY,
  // )?.value;
  
  // // В dev режиме используем dev куку как fallback
  // if (!refreshToken && process.env.NODE_ENV === 'development') {
  //   refreshToken = request.cookies.get('dev_auth_token')?.value;
  // }
  
  // const hasValidToken = refreshToken
  //   ? (await verifyJwtToken(refreshToken)) !== null
  //   : false;

  // if (!hasValidToken && !isLoginRoute) {
  //   const loginUrl = new URL(ROUTER_MAP.LOGIN, request.url);
  //   const nextPath = pathname + (search || '');

  //   if (nextPath && nextPath !== ROUTER_MAP.LOGIN) {
  //     loginUrl.searchParams.set('next', nextPath);
  //   }

  //   const response = NextResponse.redirect(loginUrl);
  //   if (refreshToken) {
  //     response.cookies.delete(env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_COOKIE_KEY);
  //     // Удаляем dev куку если в dev режиме
  //     if (process.env.NODE_ENV === 'development') {
  //       response.cookies.delete('dev_auth_token');
  //     }
  //   }
  //   return response;
  // }

  // if (hasValidToken && isLoginRoute) {
  //   const dashboardUrl = new URL(ROUTER_MAP.DASHBOARD, request.url);
  //   return NextResponse.redirect(dashboardUrl);
  // }

  // return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
