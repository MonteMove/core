import React from 'react';

import { Skeleton } from '@/shared/ui/shadcn/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/table';

type AnalyticsData = {
  id: number;
  name: string;
  currency: string;
  incoming: number;
  outgoing: number;
  transactions: number;
};

const data: AnalyticsData[] = [
  {
    id: 1,
    name: 'Счет 1',
    currency: 'RUB',
    incoming: 423,
    outgoing: 198,
    transactions: 134,
  },
  {
    id: 2,
    name: 'Счёт 2',
    currency: 'USD',
    incoming: 312,
    outgoing: 256,
    transactions: 101,
  },
  {
    id: 3,
    name: 'Счёт 3',
    currency: 'EUR',
    incoming: 287,
    outgoing: 174,
    transactions: 92,
  },
  {
    id: 7,
    name: 'Счёт 3',
    currency: 'EUR',
    incoming: 287,
    outgoing: 174,
    transactions: 92,
  },
  {
    id: 8,
    name: 'Счёт 3',
    currency: 'EUR',
    incoming: 287,
    outgoing: 174,
    transactions: 92,
  },
  {
    id: 9,
    name: 'Счёт 3',
    currency: 'EUR',
    incoming: 287,
    outgoing: 174,
    transactions: 92,
  },
  {
    id: 11,
    name: 'Счёт 3',
    currency: 'EUR',
    incoming: 287,
    outgoing: 174,
    transactions: 92,
  },
  {
    id: 21,
    name: 'Счёт 3',
    currency: 'EUR',
    incoming: 287,
    outgoing: 174,
    transactions: 92,
  },
  {
    id: 5,
    name: 'Счёт 3',
    currency: 'EUR',
    incoming: 287,
    outgoing: 174,
    transactions: 92,
  },
];

export const AnalyticsTable = () => {
  const isLoading = false;

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="text-center text-base font-semibold">
              Кошельки
            </TableCell>
            <TableCell className="text-center text-base font-semibold">
              Валюта
            </TableCell>
            <TableCell className="text-center text-base font-semibold">
              Сумма поступлений
            </TableCell>
            <TableCell className="text-center text-base font-semibold">
              Сумма расходов
            </TableCell>
            <TableCell className="text-center text-base font-semibold">
              Количество операций
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading &&
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(5)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && data && data.length > 0
            ? data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center text-sm font-medium">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium">
                    {item.currency}
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium">
                    {item.incoming}
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium">
                    {item.outgoing}
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium">
                    {item.transactions}
                  </TableCell>
                </TableRow>
              ))
            : !isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm">
                    Данных аналитики нет
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  );
};
