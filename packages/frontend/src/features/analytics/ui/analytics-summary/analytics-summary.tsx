'use client';

import React from 'react';

import { useWalletAnalytics } from '@/entities/analytics';
import { useAnalyticsFilters } from '@/features/analytics/hook/use-analytics-filters';
import { formatNumber } from '@/shared/lib/utils/format-number';
import { Card, Skeleton } from '@/shared';

export const AnalyticsSummary = () => {
  const { filters } = useAnalyticsFilters();
  const { data: analyticsData, isLoading } = useWalletAnalytics(filters);

  if (isLoading) {
    return (
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-3">
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-5 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  if (!analyticsData?.summary) {
    return null;
  }

  const { summary } = analyticsData;

  return (
    <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
      <Card className="p-3">
        <div className="text-xs font-medium text-muted-foreground">
          Кошельков
        </div>
        <div className="text-lg font-bold">
          {formatNumber(summary.totalWallets)}
        </div>
      </Card>

      <Card className="p-3">
        <div className="text-xs font-medium text-muted-foreground">Баланс</div>
        <div className="text-lg font-bold">
          {formatNumber(summary.totalBalance)}
        </div>
      </Card>

      <Card className="p-3">
        <div className="text-xs font-medium text-muted-foreground">
          Поступления
        </div>
        <div className="text-lg font-bold text-green-600">
          +{formatNumber(summary.totalComing)}
        </div>
      </Card>

      <Card className="p-3">
        <div className="text-xs font-medium text-muted-foreground">Расходы</div>
        <div className="text-lg font-bold text-red-600">
          -{formatNumber(summary.totalExpenditure)}
        </div>
      </Card>

      <Card className="p-3">
        <div className="text-xs font-medium text-muted-foreground">
          Чистый поток
        </div>
        <div
          className={`text-lg font-bold ${summary.totalNetFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          {summary.totalNetFlow >= 0 ? '+' : ''}
          {formatNumber(summary.totalNetFlow)}
        </div>
      </Card>

      <Card className="p-3">
        <div className="text-xs font-medium text-muted-foreground">
          Операций
        </div>
        <div className="text-lg font-bold">
          {formatNumber(summary.totalOperations)}
        </div>
      </Card>
    </div>
  );
};
