import { OperationForm } from '@/features/operations';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared';

export default function CreateOperationsPage() {
  return (
    <div className="items-center justify-center min-h-screen ">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Создать операцию</CardTitle>
          <CardDescription>
            Заполните все необходимые поля ниже.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OperationForm />
        </CardContent>
      </Card>
    </div>
  );
}
