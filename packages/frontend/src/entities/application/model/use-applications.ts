import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import {
  InfiniteData,
  type QueryFunctionContext,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { ApplicationService } from '@/entities/application/api/application-service';
import {
  ApplicationResponse,
  GetApplicationByIdResponse,
  GetApplicationsFilters,
  GetApplicationsResponse,
  UpdateApplicationRequest,
  getApplicationsFiltersSchema,
} from '@/entities/application/model/application-schemas';
import {
  APPLICATIONS_WITH_FILTERS_KEY,
  APPLICATION_DELETE_MUTATION_KEY,
  APPLICATION_QUERY_KEY,
} from '@/shared/utils/constants/application-key';
import { ROUTER_MAP } from '@/shared/utils/constants/router-map';

export const useUpdateApplication = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateApplicationRequest) =>
      ApplicationService.update(id, data),
    onSuccess: () => {
      router.push(ROUTER_MAP.APPLICATIONS);
      toast.success('Заявка обновлена');
    },
    onError: () => toast.error('Ошибка при обновлении'),
  });
};
export const useUpdateStatusApplication = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & UpdateApplicationRequest) =>
      ApplicationService.update(id, data),
    onSuccess: (data, variables) => {
      if (variables.status === 'done') {
        router.push(ROUTER_MAP.OPERATIONS_CREATE);
      } else {
        router.push(ROUTER_MAP.APPLICATIONS);
      }
      toast.success('Статус заявки обновлён');
    },
    onError: () => toast.error('Ошибка при обновлении статуса'),
  });
};

export const useApplications = (id: number) => {
  return useQuery<GetApplicationByIdResponse>({
    queryKey: [...APPLICATION_QUERY_KEY, id],
    queryFn: () => ApplicationService.getById(id.toString()),
  });
};

export const useInfiniteApplications = (
  filters?: GetApplicationsFilters,
  defaultLimit = 10,
) => {
  return useInfiniteQuery<
    GetApplicationsResponse,
    Error,
    InfiniteData<GetApplicationsResponse>,
    [string, Partial<GetApplicationsFilters> | undefined]
  >({
    queryKey: APPLICATIONS_WITH_FILTERS_KEY(filters),

    queryFn: async (
      context: QueryFunctionContext<
        [string, Partial<GetApplicationsFilters> | undefined]
      >,
    ) => {
      const rawPageParam = context.pageParam;
      const page =
        typeof rawPageParam === 'number'
          ? rawPageParam
          : typeof rawPageParam === 'string' && rawPageParam !== ''
            ? Number(rawPageParam)
            : 1;

      const queryFilters = context.queryKey[1] ?? {};

      const parsedFilters = getApplicationsFiltersSchema.parse({
        ...queryFilters,
        page,
        limit: queryFilters.limit ?? defaultLimit,
      });
      return await ApplicationService.getApplications(parsedFilters);
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage: GetApplicationsResponse) => {
      const { page, limit, total } = lastPage.pagination;
      const totalPages = Math.ceil(total / limit);

      return page < totalPages ? page + 1 : undefined;
    },

    getPreviousPageParam: (firstPage) => {
      const { page } = firstPage.pagination;
      return page > 1 ? page - 1 : undefined;
    },
  });
};

export const useDeleteApplication = (filters?: GetApplicationsFilters) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: APPLICATION_DELETE_MUTATION_KEY,
    mutationFn: (id: number) => ApplicationService.delete(id),

    onSuccess: () => {
      toast.success('Заявка удалена');

      queryClient.invalidateQueries({
        queryKey: APPLICATIONS_WITH_FILTERS_KEY(filters) as readonly unknown[],
      });
    },

    onError: () => {
      toast.error('Ошибка при удалении');
    },
  });
};

export const useApplicationsList = () => {
  return useQuery({
    queryKey: ['applications', 'list'],
    queryFn: () => ApplicationService.getApplications({ page: 1, limit: 100 }),
  });
};

export function useCopyApplication() {
  const copyApplication = useCallback(
    async (application: ApplicationResponse) => {
      const text = `
id заявки: ${application.id}
Статус: ${application.status == 'done' ? 'Завершена' : 'В работе'}
Сумма: ${application.amount}
Валюта: ${application.currency.code}
Тип операции: ${application.operation_type.name}
Создана: ${new Date(application.createdAt).toLocaleString()}
Исполнитель: ${application.assignee_user.username}
Дата встречи: ${new Date(application.meetingDate).toLocaleString()}
Телефон: ${application.phone || 'Не указано'}
Telegram: ${application.telegramUsername || 'Не указано'}
Описание: ${application.description || 'Не указано'}
`;

      try {
        await navigator.clipboard.writeText(text);
        toast.success('Скопировано в буфер обмена');
        return true;
      } catch (err) {
        console.error('Ошибка при копировании:', err);
        toast.error('Не удалось скопировать');
        return false;
      }
    },
    [],
  );

  return { copyApplication };
}
