"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { useOperationTypes } from "@/entities/operations";
import { ReportsConversionSchema } from "@/entities/reports";
import { useConversionReport } from "@/entities/reports";
import { usePopapStore } from "@/entities/reports";
import { cn } from "@/shared";
import { Button } from "@/shared";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared";
import { Input } from "@/shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared";
import { SheetDescription, SheetHeader, SheetTitle } from "@/shared";
import { Skeleton } from "@/shared";

export function ReportsConversionForm() {
  const { data: operationTypes, isLoading: operationTypesLoading } = useOperationTypes();
  const { mutate: conversionReport, isPending } = useConversionReport();
  const setActive = usePopapStore((state) => state.setActive);
  const form = useForm<z.input<typeof ReportsConversionSchema>>({
    resolver: zodResolver(ReportsConversionSchema),
    defaultValues: {
      dateStart: "",
      dateEnd: "",
      operationTypeId: "",
    },
  });
  const onSubmit = (values: z.input<typeof ReportsConversionSchema>) => {
    conversionReport(values);
    setActive(false);
  };
  return (
    <SheetHeader>
      <SheetTitle>Формирование отчета</SheetTitle>
      <SheetDescription>
        Заполните поля для общего формирования отчёта по конвертациям
      </SheetDescription>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col justify-center"
        >
          <FormField
            control={form.control}
            name="dateStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Начало периода</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value ? String(field.value).slice(0, 10) : ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v ? new Date(`${v}T00:00:00`).toISOString() : "");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Конец периода</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value ? String(field.value).slice(0, 10) : ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v ? new Date(`${v}T00:00:00`).toISOString() : "");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="operationTypeId"
            render={({ field, fieldState }) => (
              <FormItem className="w-full min-[450px]:col-span-2 lg:col-span-1">
                <FormLabel>Тип операции</FormLabel>
                {operationTypesLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={cn("w-full", fieldState.error && "border-red-500")}>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      {operationTypes?.map((operationType) => (
                        <SelectItem key={operationType.id} value={operationType.id}>
                          {operationType.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit"> {isPending ? "Загрузка..." : "Получить отчет"}</Button>
        </form>
      </Form>
    </SheetHeader>
  );
}
