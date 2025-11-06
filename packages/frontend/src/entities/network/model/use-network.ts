import { useQuery } from '@tanstack/react-query';

import { networkApi } from '../api/network-api';

export const useNetwork = (id: string) => {
  return useQuery({
    queryKey: ['network', id],
    queryFn: async () => {
      const response = await networkApi.getNetwork(id);
      return response.network;
    },
    enabled: !!id,
  });
};
