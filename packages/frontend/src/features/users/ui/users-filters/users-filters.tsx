'use client';

import { useEffect, useMemo, useState } from 'react';

import { z } from 'zod';

import { GetUsersParamsSchema } from '@/entities/users';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@/shared';

import { useSetQueryParam } from '../../hooks/use-set-query-param';

type UsersFiltersState = z.infer<typeof GetUsersParamsSchema>;

const SORT_FIELDS: { value: UsersFiltersState['sortField']; label: string }[] =
  [
    { value: 'createdAt', label: 'Дате создания' },
    { value: 'username', label: 'Имени' },
    { value: 'lastLogin', label: 'Последнему входу' },
  ];

const SORT_ORDERS: { value: UsersFiltersState['sortOrder']; label: string }[] =
  [
    { value: 'asc', label: 'Возрастанию' },
    { value: 'desc', label: 'Убыванию' },
  ];

const USER_ROLES: {
  value: NonNullable<UsersFiltersState['roleCode']>;
  label: string;
}[] = [
  { value: 'admin', label: 'Админ' },
  { value: 'moderator', label: 'Модератор' },
  { value: 'user', label: 'Пользователь' },
];

export const UsersFilters = () => {
  const { setAllQueryParams } = useSetQueryParam();

  const defaults = useMemo<UsersFiltersState>(
    () => ({
      page: 1,
      limit: 100,
    }),
    [],
  );
  const [filters, setFilters] = useState<UsersFiltersState>(defaults);
  const [showFilters, setShowFilters] = useState<boolean>(true);

  useEffect(() => {
    setAllQueryParams(filters);
  }, [filters, setAllQueryParams]);

  const resetFilters = () => {
    setFilters({ page: 1, limit: 100 });
    setAllQueryParams({ page: 1, limit: 100 });
  };

  useEffect(() => {
    setFilters(defaults);
  }, [defaults]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-end">
        <Button variant="outline" onClick={resetFilters}>
          Сбросить
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
        </Button>
      </div>

      {showFilters && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <Label>Поиск:</Label>
              <Input
                value={filters.search ?? ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value || undefined,
                  }))
                }
                placeholder="Введите имя"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Telegram ID:</Label>
                <Input
                  value={filters.telegramId ?? ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      telegramId: e.target.value || undefined,
                    }))
                  }
                  placeholder="Введите Telegram ID"
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Сортировать по:</Label>
                <Select
                  value={filters.sortField ?? ''}
                  onValueChange={(val) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortField: val
                        ? (val as UsersFiltersState['sortField'])
                        : undefined,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_FIELDS.map((f) => (
                      <SelectItem key={f.value} value={String(f.value)}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
            <div className="flex flex-col gap-2">
              <Label>Порядок по:</Label>
              <Select
                value={filters.sortOrder ?? ''}
                onValueChange={(val) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortOrder: val
                      ? (val as UsersFiltersState['sortOrder'])
                      : undefined,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Все" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_ORDERS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Роли:</Label>
              <Select
                value={filters.roleCode ?? ''}
                onValueChange={(val) =>
                  setFilters((prev) => ({
                    ...prev,
                    roleCode: val
                      ? (val as UsersFiltersState['roleCode'])
                      : undefined,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Все" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-4 mt-5">
              <div className="flex items-center gap-2">
                <Switch
                  checked={!!filters.isHolder}
                  onCheckedChange={(checked: boolean) =>
                    setFilters((prev) => ({
                      ...prev,
                      isHolder: checked ? true : undefined,
                    }))
                  }
                />
                <Label className="font-medium">Держатели</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={!!filters.isCourier}
                  onCheckedChange={(checked: boolean) =>
                    setFilters((prev) => ({
                      ...prev,
                      isCourier: checked ? true : undefined,
                    }))
                  }
                />
                <Label className="font-medium">Курьеры</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={!!filters.blocked}
                  onCheckedChange={(checked: boolean) =>
                    setFilters((prev) => ({
                      ...prev,
                      blocked: checked ? true : undefined,
                    }))
                  }
                />
                <Label className="font-medium">Заблокированные</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={!!filters.telegramNotifications}
                  onCheckedChange={(checked: boolean) =>
                    setFilters((prev) => ({
                      ...prev,
                      telegramNotifications: checked ? true : undefined,
                    }))
                  }
                />
                <Label className="font-medium">Telegram уведомления</Label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
