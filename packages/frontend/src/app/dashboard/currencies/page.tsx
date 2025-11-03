'use client';

import { useCallback, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Plus, RotateCcw, Trash2 } from 'lucide-react';

import { useCurrencies } from '@/entities/currency/model/use-currencies';
import { useDeleteCurrency } from '@/features/currencies/hooks/use-delete-currency';
import { useRestoreCurrency } from '@/features/currencies/hooks/use-restore-currency';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/shadcn/table';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/shadcn/tabs';
import { ROUTER_MAP } from '@/shared/utils/constants/router-map';

export default function CurrenciesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState<string | null>(null);

  const tab = searchParams.get('tab') || 'all';
  const showDeleted = tab === 'deleted';

  const { data, isLoading } = useCurrencies(showDeleted ? true : undefined);
  const deleteMutation = useDeleteCurrency();
  const restoreMutation = useRestoreCurrency();

  const handleTabChange = useCallback(
    (value: string) => {
      router.push(`${ROUTER_MAP.CURRENCIES}?tab=${value}`);
    },
    [router],
  );

  const handleDeleteClick = (id: string) => {
    setCurrencyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (currencyToDelete) {
      await deleteMutation.mutateAsync(currencyToDelete);
      setDeleteDialogOpen(false);
      setCurrencyToDelete(null);
    }
  };

  const handleRestore = async (id: string) => {
    await restoreMutation.mutateAsync(id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Валюты</CardTitle>
          <Button asChild>
            <Link href={ROUTER_MAP.CURRENCIES_CREATE}>
              <Plus className="w-4 h-4 mr-2" />
              Создать валюту
            </Link>
          </Button>
        </CardHeader>

        <Tabs value={tab} onValueChange={handleTabChange} className="px-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="deleted">Удалённые</TabsTrigger>
          </TabsList>
        </Tabs>

        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Загрузка...
            </div>
          ) : data?.currencies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {showDeleted ? 'Нет удалённых валют' : 'Валюты ещё не созданы'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Код</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.currencies.map((currency) => (
                  <TableRow key={currency.id}>
                    <TableCell className="font-medium">
                      {currency.code}
                    </TableCell>
                    <TableCell>{currency.name}</TableCell>
                    <TableCell className="text-right">
                      {showDeleted ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestore(currency.id)}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(currency.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить валюту?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Валюта будет удалена из системы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
