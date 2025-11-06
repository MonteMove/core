'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ListChecks, Pencil, Plus, Trash2 } from 'lucide-react';

import { useOperationTypes } from '@/entities/operations/model/use-operation-type';
import { useDeleteOperationType } from '@/features/operation-types/hooks/use-delete-operation-type';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  ROUTER_MAP,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared';

export default function OperationTypesPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [operationTypeToDelete, setOperationTypeToDelete] = useState<
    string | null
  >(null);

  const { data: operationTypes, isLoading } = useOperationTypes();
  const deleteMutation = useDeleteOperationType();

  const handleDeleteClick = (id: string) => {
    setOperationTypeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (operationTypeToDelete) {
      await deleteMutation.mutateAsync(operationTypeToDelete);
      setDeleteDialogOpen(false);
      setOperationTypeToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-2xl">Типы операций</CardTitle>
          <Button asChild>
            <Link href={ROUTER_MAP.OPERATION_TYPES_CREATE}>
              <Plus className="w-4 h-4 mr-2" />
              Создать тип операции
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Загрузка...
            </div>
          ) : !operationTypes || operationTypes.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ListChecks />
                </EmptyMedia>
                <EmptyContent>
                  <EmptyTitle>Типы операций ещё не созданы</EmptyTitle>
                  <EmptyDescription>
                    Создайте первый тип операции для использования в системе.
                  </EmptyDescription>
                </EmptyContent>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Отдельный таб</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operationTypes.map((operationType) => (
                    <TableRow
                      key={operationType.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        router.push(
                          `${ROUTER_MAP.OPERATION_TYPES_EDIT}/${operationType.id}`,
                        )
                      }
                    >
                      <TableCell className="font-medium">
                        {operationType.name}
                      </TableCell>
                      <TableCell>
                        {operationType.description || 'Не указано'}
                      </TableCell>
                      <TableCell>
                        {operationType.isSeparateTab ? 'Да' : 'Нет'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `${ROUTER_MAP.OPERATION_TYPES_EDIT}/${operationType.id}`,
                              );
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(operationType.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить тип операции?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя будет отменить. Тип операции будет удален
              навсегда.
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
