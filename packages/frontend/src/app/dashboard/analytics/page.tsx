import { Metadata } from 'next';

import { AnalyticsCharts } from '@/features/analytics/ui/analytics-chart/analytics-chart';
import { AnalyticsFilters } from '@/features/analytics/ui/analytics-filters/analytics-filters';
import { AnalyticsTable } from '@/features/analytics/ui/analytics-table/analytics-table';

export const metadata: Metadata = {
  title: 'Аналитика',
};

export default function AnalyticsPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold">Аналитика</h1>
      <AnalyticsCharts />
      <AnalyticsFilters />
      <AnalyticsTable />
    </div>
  );
}
