'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { AuthService } from '@/entities/auth/api/auth-service';
import { LoginRequest } from '@/entities/auth/model/auth-schemas';
import { useAuthStore } from '@/features/users/ui/user-stores/user-store';
import { LOGIN_QUERY_KEY } from '@/shared/utils/constants/auth-query-key';
import { ROUTER_MAP } from '@/shared/utils/constants/router-map';

export const useLogin = () => {
  const { setToken, setUser, clearToken } = useAuthStore();
  const navigate = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationKey: LOGIN_QUERY_KEY,
    mutationFn: (loginData: LoginRequest) => {
      void clearToken();
      return AuthService.Login(loginData);
    },
    onSuccess: (data) => {
      setToken(data.accessToken);
      setUser(data.user);
      
      if (process.env.NODE_ENV === 'development') {
        document.cookie = `dev_auth_token=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
      
      toast.success('Вход выполнен успешно');

      const nextPath = searchParams.get('next');
      const redirectPath = nextPath || ROUTER_MAP.DASHBOARD;

      navigate.push(redirectPath);
    },
    onError: (error) => {
      console.log('Error: ', error);
      toast.error('Ошибка входа. Проверьте имя пользователя или пароль.');
    },
  });
};
