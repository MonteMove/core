'use client';

import { Fragment, useState } from 'react';

import { GetGuidesParamsRequest } from '@/entities/guides';
import { GuidesFilters } from '@/features/guides/ui/guide-filters/guide-filters';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

import { GuidesList } from '../guides-list/guides-list';

export const GuidesPageContent = () => {
  const [filters, setFilters] = useState<GetGuidesParamsRequest>({
    sortField: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  });

  const handleFiltersChange = (newFilters: GetGuidesParamsRequest) => {
    setFilters(newFilters);
  };
  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Список справочников</CardTitle>
        </CardHeader>
        <CardContent>
          <GuidesFilters onFiltersChange={handleFiltersChange} />
        </CardContent>
      </Card>
      <GuidesList filters={filters} />
    </Fragment>
  );
};
