'use client';

import { useParams } from 'next/navigation';

import { useApplications } from '@/entities/application';
import { EditApplicationForm } from '@/features/application/ui/edit-application/edit-application';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export default function EditApplicationPage() {
  const params = useParams<{ id: string }>();
  const id = params.id ? parseInt(params.id, 10) : 0;
  const { data: application, isLoading, error } = useApplications(id);

  if (isLoading)
    return (
      <div className="items-center justify-center min-h-screen">
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader className="justify-items-center">
            <CardTitle>Загрузка...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  if (error)
    return (
      <div className="items-center justify-center min-h-screen">
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader className="justify-items-center">
            <CardTitle>Ошибка загрузки заявки</CardTitle>
            <CardDescription>Ошибка: {error.message}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );

  if (!application)
    return (
      <div className="items-center justify-center min-h-screen">
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader className="justify-items-center">
            <CardTitle>Заявка не найдена</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );

  return (
    <div className="items-center justify-center min-h-screen">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Редактировать заявку</CardTitle>
          <CardDescription>Измените все необходимые поля ниже.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditApplicationForm initialData={application} />
        </CardContent>
      </Card>
    </div>
  );
}
