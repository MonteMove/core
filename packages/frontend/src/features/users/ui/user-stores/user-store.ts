import { create } from 'zustand';

import { UserAuth } from '@/entities/users/model/user-schemas';
import { isDevelopment } from '@/shared/lib/env-config';
import { AUTH_TOKEN_KEY } from '@/shared/utils/constants/storage-keys';

export interface AuthState {
  clearToken: () => Promise<void>;
  setToken: (token: string | null) => Promise<void>;
  setUser: (user: UserAuth | null) => void;
  initializeAuth: () => void;
  token: string | null;
  user: UserAuth | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user: UserAuth | null) => set({ user }),
  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (storedToken) {
        set({ token: storedToken });

        if (isDevelopment && typeof document !== 'undefined') {
          document.cookie = `${AUTH_TOKEN_KEY}=${storedToken}; path=/; max-age=86400; SameSite=lax`;
        }
      }
    }
  },
  setToken: async (token: string | null) => {
    if (token) {
      set({ token });
      localStorage.setItem(AUTH_TOKEN_KEY, token);

      if (isDevelopment && typeof document !== 'undefined') {
        document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=lax`;
      }
    }
  },
  clearToken: async () => {
    set({ token: null, user: null });
    localStorage.removeItem(AUTH_TOKEN_KEY);

    if (isDevelopment && typeof document !== 'undefined') {
      document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
    }
  },
}));
