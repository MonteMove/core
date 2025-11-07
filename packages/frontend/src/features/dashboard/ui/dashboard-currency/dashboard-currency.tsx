'use client';

import { useMemo } from 'react';

import type { WalletCurrencyGroup } from '@/entities/wallet';
import { Card, CardContent } from '@/shared';
import { Skeleton } from '@/shared';
import { formatNumber } from '@/shared/lib/utils/format-number';

interface DashboardCurrencyProps {
  isLoading: boolean;
  hasError: boolean;
  currencyGroups: WalletCurrencyGroup[];
}

export function DashboardCurrency({
  isLoading,
  hasError,
  currencyGroups,
}: DashboardCurrencyProps) {
  const summaries = useMemo(
    () =>
      currencyGroups.map((group) => {
        const totalAmount = group.wallets.reduce(
          (acc, wallet) => acc + wallet.amount,
          0,
        );
        const walletsCount = group.wallets.length;
        const firstWallet = group.wallets[0];
        const currencyCode =
          firstWallet?.currency.code ?? group.currency.toUpperCase();
        const currencyName = firstWallet?.currency.name ?? currencyCode;

        return {
          key: group.currency,
          totalAmount,
          walletsCount,
          currencyCode,
          currencyName,
        };
      }),
    [currencyGroups],
  );

  if (hasError) {
    return (
      <div className="w-full">
        <Card className="w-full min-h-[124px] flex items-center mb-2">
          <CardContent className="p-4 text-sm text-destructive">
            Не удалось загрузить данные о кошельках
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-[124px]">
        <div className="w-full max-w-7xl mx-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          <div className="flex gap-4 pb-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="min-w-[280px] flex-shrink-0 p-0">
                <CardContent className="flex flex-col p-4 gap-1">
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-4 w-16 mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currencyGroups.length === 0) {
    return (
      <div className="w-full">
        <Card className="w-full min-h-[124px] flex items-center">
          <CardContent className="p-4 text-sm text-muted-foreground">
            Нет закрепленных кошельков
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
