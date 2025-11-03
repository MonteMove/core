import { Metadata } from 'next';

import { AnalyticsCharts } from '@/features/analytics/ui/analytics-chart/analytics-chart';
import { AnalyticsFilters } from '@/features/analytics/ui/analytics-filters/analytics-filters';
import { AnalyticsTable } from '@/features/analytics/ui/analytics-table/analytics-table';
import { Card, CardHeader, CardTitle } from '@/shared/ui/shadcn/card';

export const metadata: Metadata = {
  title: 'Аналитика',
};

export default function AnalyticsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Аналитика</CardTitle>
        </CardHeader>
      </Card>

      <AnalyticsCharts />
      <AnalyticsFilters />
      <AnalyticsTable />
    </div>
  );
}
