'use client';

import { useParams } from 'next/navigation';

import { useOperation } from '@/entities/operations';
import { OperationForm } from '@/features/operations';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/shared';

export default function EditOperationPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: operation, isLoading, isError } = useOperation(id);

  if (isLoading) {
    return (
      <div className="items-center justify-center min-h-screen">
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !operation) {
    return (
      <div className="items-center justify-center min-h-screen">
        <Card className="w-full max-w-5xl mx-auto">
          <CardContent className="p-8 text-center text-destructive">
            Не удалось загрузить операцию
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="items-center justify-center min-h-screen">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Редактировать операцию</CardTitle>
          <CardDescription>
            Измените необходимые поля ниже и сохраните изменения.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OperationForm initialData={operation} />
        </CardContent>
      </Card>
    </div>
  );
}
