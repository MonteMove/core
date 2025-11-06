'use client';

import { CreateApplicationForm } from '@/features/application/ui/create-application/create-application-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export default function CreateApplicationPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Создать заявку</CardTitle>
          <CardDescription>
            Заполните все необходимые поля ниже.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateApplicationForm />
        </CardContent>
      </Card>
    </div>
  );
}
