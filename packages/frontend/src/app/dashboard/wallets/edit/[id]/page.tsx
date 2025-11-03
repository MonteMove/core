'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { WalletService } from '@/entities/wallet/api/wallet-service';
import { WalletForm } from '@/features/wallets/ui/wallet-form/wallet-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';
import { ROUTER_MAP } from '@/shared/utils/constants/router-map';

interface EditWalletPageProps {
  params: Promise<{ id: string }>;
}

export default function EditWalletPage({ params }: EditWalletPageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: wallet, isLoading, error } = useQuery({
    queryKey: ['wallet', id],
    queryFn: () => WalletService.getWalletById(id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (error || !wallet) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">Ошибка загрузки кошелька</p>
          <button
            onClick={() => router.push(ROUTER_MAP.WALLETS)}
            className="text-primary underline"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Редактировать кошелек
          </CardTitle>
          <CardDescription>
            Обновите информацию о кошельке.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WalletForm initialData={wallet} walletId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
