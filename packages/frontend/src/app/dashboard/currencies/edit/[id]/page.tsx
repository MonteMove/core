'use client';

import { use } from 'react';

import { useCurrencyById } from '@/entities/currency/model/use-currency-by-id';
import { CurrencyForm } from '@/features/currencies/ui/currency-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export default function EditCurrencyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: currency, isLoading } = useCurrencyById(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-start">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              Загрузка...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currency) {
    return (
      <div className="flex justify-center items-start">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              Валюта не найдена
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Редактировать валюту
          </CardTitle>
          <CardDescription>Измените данные валюты.</CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyForm isEdit initialData={currency} />
        </CardContent>
      </Card>
    </div>
  );
}
