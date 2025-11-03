import { Metadata } from 'next';

import { NetworkForm } from '@/features/network/ui/network-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export const metadata: Metadata = {
  title: 'Создать сеть',
};

export default function CreateNetworkPage() {
  return (
    <div className="flex justify-center items-start">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Создать сеть</CardTitle>
          <CardDescription>
            Заполните форму, чтобы добавить новую сеть.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NetworkForm />
        </CardContent>
      </Card>
    </div>
  );
}
