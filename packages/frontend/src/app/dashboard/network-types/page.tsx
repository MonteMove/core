'use client';

import { useCallback, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Plus, RotateCcw, Trash2 } from 'lucide-react';

import { useNetworkTypesList } from '@/entities/network/model/use-network-types-list';
import { useDeleteNetworkType } from '@/features/network/hooks/use-delete-network-type';
import { useRestoreNetworkType } from '@/features/network/hooks/use-restore-network-type';
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

export default function NetworkTypesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [networkTypeToDelete, setNetworkTypeToDelete] = useState<string | null>(
    null,
  );

  const tab = searchParams.get('tab') || 'all';
  const showDeleted = tab === 'deleted' ? true : undefined;

  const { data, isLoading } = useNetworkTypesList(showDeleted);
  const deleteMutation = useDeleteNetworkType();
  const restoreMutation = useRestoreNetworkType();

  const handleTabChange = useCallback(
    (value: string) => {
      router.push(`${ROUTER_MAP.NETWORK_TYPES}?tab=${value}`);
    },
    [router],
  );

  const handleDeleteClick = (id: string) => {
    setNetworkTypeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (networkTypeToDelete) {
      await deleteMutation.mutateAsync(networkTypeToDelete);
      setDeleteDialogOpen(false);
      setNetworkTypeToDelete(null);
    }
  };

  const handleRestore = async (id: string) => {
    await restoreMutation.mutateAsync(id);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Типы сетей</CardTitle>
          <Button asChild>
            <Link href={ROUTER_MAP.NETWORK_TYPES_CREATE}>
              <Plus className="w-4 h-4 mr-2" />
              Создать тип сети
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
          ) : data?.networkTypes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {tab === 'deleted'
                  ? 'Нет удалённых типов сетей'
                  : 'Типы сетей ещё не созданы'}
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
                {data?.networkTypes.map((networkType) => (
                  <TableRow key={networkType.id}>
                    <TableCell className="font-medium">
                      {networkType.code}
                    </TableCell>
                    <TableCell>{networkType.name}</TableCell>
                    <TableCell className="text-right">
                      {networkType.deleted ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRestore(networkType.id)}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(networkType.id)}
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
            <AlertDialogTitle>Удалить тип сети?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Тип сети будет удалён из системы.
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
