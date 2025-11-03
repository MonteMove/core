'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/shared';

const CalculatorPage = dynamic(
  () => import('@/features/calculator/ui/calculator-page'),
  {
    ssr: false,
    loading: () => <Skeleton />,
  },
);

export default function Calculator() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <CalculatorPage />
    </div>
  );
}
