import { CreateUserForm } from '@/features/users/ui/create-users/create-user-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export default function CreateUserPage() {
  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Создать пользователя
          </CardTitle>
          <CardDescription>
            Введите данные, чтобы добавить нового пользователя
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>
    </div>
  );
}
