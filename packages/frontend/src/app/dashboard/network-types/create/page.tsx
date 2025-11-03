import { Metadata } from 'next';

import { NetworkTypeForm } from '@/features/network/ui/network-type-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export const metadata: Metadata = {
  title: 'Создать тип сети',
};

export default function CreateNetworkTypePage() {
  return (
    <div className="flex justify-center items-start">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Создать тип сети</CardTitle>
          <CardDescription>
            Заполните форму, чтобы добавить новый тип сети.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NetworkTypeForm />
        </CardContent>
      </Card>
    </div>
  );
}
