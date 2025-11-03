import { OperationResponseDto } from '@/schemas/opeartions-schemas';

// src/hooks/__mocks__/use-users.mock.ts
export function useUsers() {
  return {
    data: {
      users: [
        { id: 'u1', username: 'Admin' },
        { id: 'u2', username: 'User1' },
        { id: 'u3', username: 'User2' },
      ],
    },
  };
}

// src/hooks/__mocks__/use-operation-type.mock.ts
export function useOperationTypes() {
  return {
    data: [
      { id: 't1', name: 'Пополнение' },
      { id: 't2', name: 'Перевод' },
      { id: 't3', name: 'Списание' },
    ],
    isLoading: false,
  };
}

// src/hooks/__mocks__/use-operations.mock.ts
export function useInfiniteOperations() {
  return {
    data: {
      pages: [
        {
          operations: [
            {
              id: 'op-1',
              createdAt: '2025-10-10 12:30',
              type: { id: 't1', name: 'Пополнение' },
              created_by: { username: 'Admin' },
              description: 'Зачисление на основной счёт',
              entries: [
                {
                  id: 'ent-1',
                  wallet: { id: 'w1', name: 'Основной счёт' },
                  direction: 'credit',
                  before: 1200,
                  amount: 300,
                  after: 1500,
                },
              ],
            },
            {
              id: 'op-2',
              createdAt: '2025-10-11 14:45',
              type: { id: 't2', name: 'Перевод' },
              created_by: { username: 'User1' },
              description: 'Перевод на резервный счёт',
              entries: [
                {
                  id: 'ent-2',
                  wallet: { id: 'w2', name: 'Резервный счёт' },
                  direction: 'debit',
                  before: 500,
                  amount: 200,
                  after: 300,
                },
                {
                  id: 'ent-3',
                  wallet: { id: 'w3', name: 'Основной счёт' },
                  direction: 'credit',
                  before: 1000,
                  amount: 200,
                  after: 1200,
                },
              ],
            },
          ],
        },
      ],
    },
    isLoading: false,
    isFetching: false,
    error: null,
    fetchNextPage: () => {},
    hasNextPage: false,
  };
}

export function useDeleteOperation() {
  return {
    mutate: (id: string) => console.log(`🗑️ Удалено: ${id}`),
  };
}

export function useCopyOperation() {
  return {
    copyOperation: (operation: OperationResponseDto) =>
      console.log('📋 Скопировано:', operation.description),
  };
}
