'use client';

import Link from 'next/link';

import { Plus } from 'lucide-react';

import { ApplicationsFilters } from '@/features/application/ui/application-filters/filters-applications';
import { InfiniteApplicationsList } from '@/features/application/ui/infinite-applications/infinite-applications';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';
import { ROUTER_MAP } from '@/shared/utils/constants/router-map';

export default function ApplicationsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-2xl">Заявки</CardTitle>
          <Button asChild className="md:w-auto">
            <Link
              href={ROUTER_MAP.APPLICATIONS_CREATE}
              className="inline-flex items-center gap-2"
            >
              <Plus className="size-4" />
              <span>Создать заявку</span>
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <ApplicationsFilters />
        </CardContent>
      </Card>

      <InfiniteApplicationsList />
    </div>
  );
}
