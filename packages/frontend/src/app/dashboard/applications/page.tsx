'use client';

import { ApplicationsFilters } from '@/features/application/ui/application-filters/filters-applications';
import { InfiniteApplicationsList } from '@/features/application/ui/infinite-applications/infinite-applications';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export default function ApplicationsPage() {
  return (
    <div>
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Заявки</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationsFilters />
        </CardContent>
      </Card>

      <InfiniteApplicationsList />
    </div>
  );
}
