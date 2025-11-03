import { Metadata } from 'next';

import { WalletTypeForm } from '@/features/wallet-types/ui/wallet-type-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export const metadata: Metadata = {
  title: 'Создать тип кошелька',
};

export default function CreateWalletTypePage() {
  return (
    <div className="flex justify-center items-start">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Создать тип кошелька
          </CardTitle>
          <CardDescription>
            Заполните форму, чтобы добавить новый тип кошелька.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WalletTypeForm />
        </CardContent>
      </Card>
    </div>
  );
}
