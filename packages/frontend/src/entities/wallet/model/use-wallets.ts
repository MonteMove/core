'use client';

import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { WalletService } from '@/entities/wallet/api/wallet-service';
import { GetWalletsFilter } from '@/entities/wallet/model/wallet-schemas';
import {
  PINNED_WALLETS_QUERY_KEY,
  WALLETS_QUERY_KEY,
} from '@/shared/utils/constants/wallets-query-key';

export const usePinnedWallets = () => {
  const queryResult = useQuery({
    queryKey: PINNED_WALLETS_QUERY_KEY,
    queryFn: () => WalletService.getPinnedWallets(),
  });

  useEffect(() => {
    if (queryResult.isError && queryResult.error) {
      toast.error('Не удалось загрузить закрепленные кошельки');
    }
  }, [queryResult.isError, queryResult.error]);

  return queryResult;
};

export const useWallets = (filters?: Partial<GetWalletsFilter>) => {
  const queryResult = useQuery({
    queryKey: [...WALLETS_QUERY_KEY, filters],
    queryFn: () => WalletService.getWallets(filters),
  });

  useEffect(() => {
    if (queryResult.isError && queryResult.error) {
      toast.error('Не удалось загрузить кошельки');
    }
  }, [queryResult.isError, queryResult.error]);

  return queryResult;
};
