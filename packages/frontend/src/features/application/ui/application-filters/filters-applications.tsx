'use client';

import { useEffect, useMemo, useState } from 'react';

import { FilterIcon } from 'lucide-react';
import { z } from 'zod';

import {
  getApplicationsFiltersSchema,
  useSetApplicationQueryParam,
} from '@/entities/application';
import {
  Badge,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared';

type ApplicationsFiltersState = z.infer<typeof getApplicationsFiltersSchema>;

const SORT_ORDERS: {
  value: ApplicationsFiltersState['sortOrder'];
  label: string;
}[] = [
  { value: 'desc', label: 'Сначала новые' },
  { value: 'asc', label: 'Сначала старые' },
];

const STATUS_OPTIONS: {
  value: NonNullable<ApplicationsFiltersState['status']>;
  label: string;
}[] = [
  { value: 'open', label: 'В работе' },
  { value: 'done', label: 'Завершена' },
];

export function ApplicationsFilters() {
  const { setAllQueryParams } = useSetApplicationQueryParam();
  const [sheetOpen, setSheetOpen] = useState(false);

  const defaults = useMemo<ApplicationsFiltersState>(
    () => ({
      page: 1,
      limit: 10,
    }),
    [],
  );
  const [localFilters, setLocalFilters] =
    useState<ApplicationsFiltersState>(defaults);

  const handleApplyFilters = () => {
    setAllQueryParams(localFilters);
    setSheetOpen(false);
  };

  const resetFilters = () => {
    const resetState = { page: 1, limit: 10 };
    setLocalFilters(resetState);
    setAllQueryParams(resetState);
    setSheetOpen(false);
  };

  useEffect(() => {
    setLocalFilters(defaults);
  }, [defaults]);

  const activeFiltersCount = [
    localFilters.status,
    localFilters.sortField,
    localFilters.sortOrder,
  ].filter(Boolean).length;

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <FilterIcon className="h-4 w-4 mr-2" />
          Фильтры
          {activeFiltersCount > 0 && (
            <Badge
              variant="destructive"
              className="ml-2 h-5 min-w-5 px-1 flex items-center justify-center"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Фильтры заявок</SheetTitle>
          <SheetDescription>
            Настройте параметры для фильтрации списка заявок
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 px-4">
          <div className="space-y-2">
            <Label>Статус</Label>
            <Select
              value={localFilters.status ?? ''}
              onValueChange={(val) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: val
                    ? (val as ApplicationsFiltersState['status'])
                    : undefined,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Все" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Порядок сортировки</Label>
            <Select
              value={localFilters.sortOrder ?? ''}
              onValueChange={(val) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  sortOrder: val
                    ? (val as ApplicationsFiltersState['sortOrder'])
                    : undefined,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Сначала новые" />
              </SelectTrigger>
              <SelectContent>
                {SORT_ORDERS.map((order) => (
                  <SelectItem key={order.value!} value={order.value!}>
                    {order.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-6">
            <Button variant="outline" onClick={resetFilters} className="flex-1">
              Сбросить
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1">
              Применить
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
