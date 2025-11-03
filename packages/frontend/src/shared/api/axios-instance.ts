import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { AuthService } from '@/entities/auth/api/auth-service';
import { useAuthStore } from '@/features/users/ui/user-stores/user-store';
import { env } from '@/shared/lib/env-config';
import { AUTH_TOKEN_KEY } from '@/shared/utils/constants/storage-keys';

export const BASE_URL = env.NEXT_PUBLIC_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

axiosInstance.interceptors.request.use((config) => {
  const token =
    useAuthStore.getState().token ||
    (typeof window !== 'undefined'
      ? localStorage.getItem(AUTH_TOKEN_KEY)
      : null);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers['Content-Type'] =
    config.headers['Content-Type'] ?? 'application/json';

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            console.log(token);
            if (token) {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${token}`,
              };
              resolve(axiosInstance(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { setToken, token: stateToken } = useAuthStore.getState();
        const currentToken =
          stateToken ||
          (typeof window !== 'undefined'
            ? localStorage.getItem(AUTH_TOKEN_KEY)
            : null);

        const data = await AuthService.refreshTokenRaw(
          currentToken || undefined,
        );
        await setToken(data.accessToken);

        isRefreshing = false;
        onRefreshed(data.accessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.accessToken}`,
        };
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshed(null);
        const { clearToken } = useAuthStore.getState();
        await clearToken();

        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.includes('/login')
        ) {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
