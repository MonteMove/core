import { Metadata } from 'next';

import { WalletForm } from '@/features/wallets/ui/wallet-form/wallet-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export const metadata: Metadata = {
  title: 'Создать кошелек',
};

export default function CreateWalletPage() {
  return (
    <div className="flex justify-center items-start">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Создать кошелек</CardTitle>
          <CardDescription>
            Заполните форму, чтобы добавить новый кошелек.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WalletForm />
        </CardContent>
      </Card>
    </div>
  );
}
