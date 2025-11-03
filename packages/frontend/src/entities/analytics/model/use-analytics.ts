'use client';

import { useQuery } from '@tanstack/react-query';

import { AnalyticsService } from '@/entities/analytics/api/analytics-service';
import { ANALYTICS_QUERY_KEY } from '@/shared/utils/constants/analytics-query-key';

import { useAnalyticsFilters } from '../../../features/analytics/hook/use-analytics-filters';

export function useAnalytics() {
  const { month } = useAnalyticsFilters();
  return useQuery({
    queryKey: [ANALYTICS_QUERY_KEY, month],
    queryFn: () => AnalyticsService.getAnalytics(),
  });
}
