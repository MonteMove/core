"use client";

import { CreateApplicationForm } from "@/features/application/ui/create-application/create-application-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";

export default function CreateApplicationPage() {
  return (
    <div>
      <Card className="w-full max-w-5xl mx-auto ch ">
        <CardHeader>
          <CardTitle>Создать новую заявку</CardTitle>
          <CardDescription>Заполните все необходимые поля ниже.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateApplicationForm />
        </CardContent>
      </Card>
    </div>
  );
}
