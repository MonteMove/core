import { GuideForm } from '@/features/guides/ui/guide-form/guide-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';

export default function CreateGuidePage() {
  return (
    <div className="items-center justify-center min-h-screen ">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Создать справочник</CardTitle>
          <CardDescription>
            Заполните все необходимые поля ниже.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GuideForm />
        </CardContent>
      </Card>
    </div>
  );
}
