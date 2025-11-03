'use client';

import { use } from 'react';

import { useWalletType } from '@/entities/wallet-type/model/use-wallet-type';
import { WalletTypeForm } from '@/features/wallet-types/ui/wallet-type-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export default function EditWalletTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: walletType, isLoading } = useWalletType(id);

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

  if (!walletType) {
    return (
      <div className="flex justify-center items-start">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              Тип кошелька не найден
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
            Редактировать тип кошелька
          </CardTitle>
          <CardDescription>Измените данные типа кошелька.</CardDescription>
        </CardHeader>
        <CardContent>
          <WalletTypeForm isEdit initialData={walletType} />
        </CardContent>
      </Card>
    </div>
  );
}
