import { useQuery } from '@tanstack/react-query';

import { networkApi } from '../api/network-api';

export const useNetworkType = (id: string) => {
  return useQuery({
    queryKey: ['network-type', id],
    queryFn: async () => {
      const response = await networkApi.getNetworkType(id);
      return response.networkType;
    },
    enabled: !!id,
  });
};
