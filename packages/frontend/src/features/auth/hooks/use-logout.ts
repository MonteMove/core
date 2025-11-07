import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { AuthService } from '@/entities/auth/api/auth-service';
import { useAuthStore } from '@/features/users/ui/user-stores/user-store';
import { LOGOUT_QUERY_KEY } from '@/shared/utils/constants/auth-query-key';
import { ROUTER_MAP } from '@/shared/utils/constants/router-map';

export const useLogout = () => {
  const clearToken = useAuthStore().clearToken;
  const router = useRouter();

  return useMutation({
    mutationKey: [LOGOUT_QUERY_KEY],
    mutationFn: async () => await AuthService.Logout(),
    onSuccess: async () => {
      await clearToken();
      
      // Удаляем dev куку в dev режиме
      if (process.env.NODE_ENV === 'development') {
        document.cookie = 'dev_auth_token=; path=/; max-age=0';
      }
      
      router.push(ROUTER_MAP.LOGIN);
    },
  });
};
