'use client';

import { useParams } from 'next/navigation';

import { useGuide } from '@/features/guides/hooks/use-guide';
import { GuideForm } from '@/features/guides/ui/guide-form/guide-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export default function EditGuidePage() {
  const { id } = useParams<{ id: string }>();
  const { data: guide, isLoading } = useGuide(id);
  if (isLoading)
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  if (!guide)
    return (
      <div className="max-w-5xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Справочник не найден</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Редактировать справочник</CardTitle>
          <CardDescription>Измените все необходимые поля ниже.</CardDescription>
        </CardHeader>
        <CardContent>
          <GuideForm initialData={guide} />
        </CardContent>
      </Card>
    </div>
  );
}
