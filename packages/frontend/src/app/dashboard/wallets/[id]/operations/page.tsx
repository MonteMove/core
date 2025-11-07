'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { useWallet } from '@/entities/wallet';
import { useInfiniteOperations } from '@/entities/operations';
import { Button, Card, CardContent, CardHeader, Skeleton, formatDateTime } from '@/shared';
import { formatNumber } from '@/shared/lib/utils/format-number';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function WalletOperationsPage() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const params = useParams();
  const router = useRouter();
  const walletId = params.id as string;
  const lastOperationRef = useRef<HTMLDivElement | null>(null);

  const { data: wallet, isLoading: isWalletLoading } = useWallet(walletId);
  const { 
    data: operationsData,
    isLoading: isOperationsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteOperations({
    walletId,
    limit: 20,
  });

  useEffect(() => {
    if (!lastOperationRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(lastOperationRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isWalletLoading || isOperationsLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="container mx-auto py-6">
        <p className="text-muted-foreground">Кошелек не найден</p>
      </div>
    );
  }

  // Получаем все операции из всех страниц
  const allOperations = operationsData?.pages.flatMap(page => page.operations) ?? [];

  // Группируем операции по дням
  const groupedByDay = allOperations.reduce((acc, operation) => {
    const date = format(parseISO(operation.createdAt), 'yyyy-MM-dd');
    
    if (!acc[date]) {
      acc[date] = {
        date,
        operations: [],
      };
    }
    
    acc[date].operations.push(operation);
    
    return acc;
  }, {} as Record<string, { date: string; operations: typeof allOperations }>);

  // Сортируем операции внутри каждого дня по времени
  Object.values(groupedByDay).forEach(day => {
    day.operations.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  });

  // Вычисляем баланс на конец каждого дня
  const daysWithBalance = Object.values(groupedByDay).map(day => {
    // Берем последнюю операцию дня
    const lastOperation = day.operations[day.operations.length - 1];
    // Находим entry для нашего кошелька в последней операции
    const walletEntry = lastOperation?.entries.find(e => e.walletId === walletId);
    // Баланс на конец дня = after последней операции
    const endBalance = walletEntry?.after ?? 0;
    
    return {
      ...day,
      endBalance,
    };
  });

  // Сортируем дни по убыванию (новые сверху)
  const sortedDays = daysWithBalance.sort((a, b) => 
    b.date.localeCompare(a.date)
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Хедер с балансом */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{wallet.name}</h1>
                <p className="text-sm text-muted-foreground">История операций</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Текущий баланс</p>
              <p className="text-2xl font-bold">{formatNumber(wallet.amount)} {wallet.currency.code}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Группированные по дням операции */}
      <div className="space-y-4">
        {sortedDays.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Нет операций</p>
            </CardContent>
          </Card>
        ) : (
          sortedDays.map(({ date, operations, endBalance }) => (
            <div key={date} className="space-y-2">
              {/* Заголовок дня с балансом */}
              <div className="flex items-center justify-between px-2">
                <h2 className="text-lg font-semibold">
                  {format(parseISO(date), 'd MMMM yyyy', { locale: ru })}
                </h2>
                <p className="text-xl font-bold">
                  {formatNumber(endBalance)}
                </p>
              </div>
              
              {/* Операции дня */}
              {operations.map((operation, opIndex) => {
                const showDetails = expandedIds.includes(operation.id);
                const walletEntry = operation.entries.find(e => e.walletId === walletId);
                const isLastInDay = opIndex === operations.length - 1;
                const isDayLast = date === sortedDays[sortedDays.length - 1].date;
                const isLast = isLastInDay && isDayLast;
                
                return (
                  <Card
                    key={operation.id}
                    ref={isLast ? lastOperationRef : null}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() =>
                      setExpandedIds((prev) =>
                        prev.includes(operation.id)
                          ? prev.filter((id) => id !== operation.id)
                          : [...prev, operation.id],
                      )
                    }
                  >
                    <CardContent className="py-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-semibold">{operation.type.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {operation.created_by?.username}
                          </p>

                          {walletEntry && (
                            <div className="p-2 rounded-md bg-muted/50">
                              {showDetails ? (
                                <p className="text-sm">
                                  <span className="text-muted-foreground">
                                    {walletEntry.before ?? 0}
                                  </span>
                                  {' '}
                                  {walletEntry.direction === 'credit' ? '+' : '-'}
                                  {' '}
                                  <span className={walletEntry.direction === 'credit' ? 'text-success/80 font-semibold' : 'text-destructive/80 font-semibold'}>
                                    {walletEntry.amount}
                                  </span>
                                  {' = '}
                                  <span className="text-muted-foreground">
                                    {walletEntry.after ?? 0}
                                  </span>
                                </p>
                              ) : (
                                <p className="text-sm">
                                  <span className="text-muted-foreground">
                                    {walletEntry.after ?? 0}
                                  </span>
                                </p>
                              )}
                            </div>
                          )}

                          {operation.description && (
                            <p className="text-sm text-muted-foreground">
                              {operation.description}
                            </p>
                          )}
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(operation.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ))
        )}
        
        {/* Индикатор загрузки */}
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Skeleton className="h-20 w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
