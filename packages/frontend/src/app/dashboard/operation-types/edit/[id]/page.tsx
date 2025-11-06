'use client';

import { use } from 'react';

import { useOperationTypeById } from '@/entities/operations/model/use-operation-type-by-id';
import { OperationTypeForm } from '@/features/operation-types/ui/operation-type-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export default function EditOperationTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: operationType, isLoading } = useOperationTypeById(id);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!operationType) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Тип операции не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Редактировать тип операции</CardTitle>
          <CardDescription>Измените данные типа операции.</CardDescription>
        </CardHeader>
        <CardContent>
          <OperationTypeForm isEdit initialData={operationType} />
        </CardContent>
      </Card>
    </div>
  );
}
