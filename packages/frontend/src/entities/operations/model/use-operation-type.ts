'use client';

import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { OperationTypeService } from '@/entities/operations/api/operation-type-sevice';
import { OPERATION_TYPES_QUERY_KEY } from '@/shared/utils/constants/operation-types-query-key';

export const useOperationTypes = () => {
  const queryResult = useQuery({
    queryKey: [OPERATION_TYPES_QUERY_KEY],
    queryFn: () => OperationTypeService.getOperationTypes(),
  });

  useEffect(() => {
    if (queryResult.isError && queryResult.error) {
      toast.error('Не удалось загрузить типы операций');
    }
  }, [queryResult.isError, queryResult.error]);

  return queryResult;
};
