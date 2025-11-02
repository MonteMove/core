import { Metadata } from "next";

import { Card, CardDescription, CardHeader, CardTitle } from "@/shared";
import { Settings } from "@/shared/ui/components/settings";

export const metadata: Metadata = {
  title: "Настройки",
};

export default function SettingsPage() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-xl">Настройки</CardTitle>
          <CardDescription>Настройте интерфейс под себя</CardDescription>
        </CardHeader>
      </Card>
      <Settings />
    </div>
  );
}
