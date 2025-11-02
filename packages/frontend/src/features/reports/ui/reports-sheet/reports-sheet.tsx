"use client";

import { ReportGeneralForm } from "@/entities/reports";
import { ReportsConversionForm } from "@/entities/reports";
import { ReportsPeriodForm } from "@/entities/reports";
import { usePopapStore } from "@/entities/reports";
import { Sheet, SheetContent } from "@/shared/ui/shadcn/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs";

export function ReportsSheet() {
  const active = usePopapStore((state) => state.active);
  const setActive = usePopapStore((state) => state.setActive);
  return (
    <div>
      <Sheet open={active} onOpenChange={setActive}>
        <SheetContent className="pt-9">
          <Tabs defaultValue="general" className="w-[400px]">
            <TabsList className="ml-3">
              <TabsTrigger value="general">Общий</TabsTrigger>
              <TabsTrigger value="conversions">По конвертациям</TabsTrigger>
              <TabsTrigger value="period">По остаткам</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <ReportGeneralForm />
            </TabsContent>
            <TabsContent value="conversions">
              <ReportsConversionForm />
            </TabsContent>
            <TabsContent value="period">
              <ReportsPeriodForm />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </div>
  );
}
