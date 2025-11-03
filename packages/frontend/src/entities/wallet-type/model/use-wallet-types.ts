import { useQuery } from '@tanstack/react-query';

import { walletTypeApi } from '../api/wallet-type-api';

export const useWalletTypes = () => {
  return useQuery({
    queryKey: ['wallet-types'],
    queryFn: walletTypeApi.getWalletTypes,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
