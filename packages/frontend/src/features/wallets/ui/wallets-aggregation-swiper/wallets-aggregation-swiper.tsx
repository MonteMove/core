'use client';

import { useMemo } from 'react';

import { GetWalletsFilter } from '@/entities/wallet';
import { useWalletsAggregation } from '@/entities/wallet/model/use-wallets-aggregation';
import { Card, CardContent, Skeleton } from '@/shared';
import { formatNumber } from '@/shared/lib/utils/format-number';

interface WalletsAggregationSwiperProps {
  filters: GetWalletsFilter;
}

export function WalletsAggregationSwiper({
  filters,
}: WalletsAggregationSwiperProps) {
  const { data, isLoading, isFetching, isError } = useWalletsAggregation(filters);
  const showSkeleton = isLoading || isFetching;

  const summaries = useMemo(
    () =>
      (data?.currencyGroups ?? []).map((group) => ({
        key: group.currency.id,
        totalAmount: group.totalAmount,
        walletsCount: group.walletsCount,
        currencyCode: group.currency.code,
        currencyName: group.currency.name,
      })),
    [data],
  );

  if (isError) {
    return (
      <div className="w-full">
        <Card className="w-full min-h-[124px] flex items-center">
          <CardContent className="p-4 text-sm text-destructive">
            Не удалось загрузить агрегацию кошельков
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showSkeleton) {
    return (
      <div className="w-full min-h-[124px]">
        <div className="w-full max-w-7xl mx-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          <div className="flex gap-4 pb-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="min-w-[280px] flex-shrink-0 p-0">
                <CardContent className="flex flex-col p-4 gap-1">
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-4 w-16 mt-1" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="w-full">
        <Card className="w-full min-h-[124px] flex items-center">
          <CardContent className="p-4 text-sm text-muted-foreground">
            Нет кошельков по выбранным фильтрам
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-7xl mx-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
        <div className="flex gap-4 pb-2">
          {summaries.map((summary) => (
            <Card key={summary.key} className="min-w-[280px] flex-shrink-0 p-0">
              <CardContent className="flex flex-col p-4 gap-1">
                <p className="text-2xl font-semibold">
                  {formatNumber(summary.totalAmount)}
                </p>
                <p className="text-sm font-medium text-muted-foreground uppercase">
                  {summary.currencyCode}
                </p>
                <p className="text-xs text-muted-foreground">
                  Кошельков: {summary.walletsCount}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
