"use client";

import { useParams } from "next/navigation";

import { useGuide } from "@/features/guides/hooks/use-guide";
import { GuideForm } from "@/features/guides/ui/guide-form/guide-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";

export default function EditGuidePage() {
  const { id } = useParams<{ id: string }>();
  const { data: guide, isLoading } = useGuide(id);
  console.log(id);

  if (isLoading)
    return (
      <div className="items-center justify-center min-h-screen">
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader className="justify-items-center">
            <CardTitle>Загрузка...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  if (!guide)
    return (
      <div className="items-center justify-center min-h-screen">
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader className="justify-items-center">
            <CardTitle>Справочник не найден</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );

  return (
    <div className="items-center justify-center min-h-screen">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Редактировать справочник</CardTitle>
          <CardDescription>Измените все необходимые поля ниже.</CardDescription>
        </CardHeader>
        <CardContent>
          <GuideForm initialData={guide} />
        </CardContent>
      </Card>
    </div>
  );
}
