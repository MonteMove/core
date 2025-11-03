import { Metadata } from 'next';

import { CurrencyForm } from '@/features/currencies/ui/currency-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export const metadata: Metadata = {
  title: 'Создать валюту',
};

export default function CreateCurrencyPage() {
  return (
    <div className="flex justify-center items-start">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Создать валюту</CardTitle>
          <CardDescription>
            Заполните форму, чтобы добавить новую валюту.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyForm />
        </CardContent>
      </Card>
    </div>
  );
}
