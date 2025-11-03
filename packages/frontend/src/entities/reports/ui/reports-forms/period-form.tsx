'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { ReportsPeriodSchema } from '@/entities/reports';
import { usePeriodReport } from '@/entities/reports';
import { usePopapStore } from '@/entities/reports';
import { Button } from '@/shared';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared';
import { SheetDescription, SheetHeader, SheetTitle } from '@/shared';

export function ReportsPeriodForm() {
  const { mutate: periodReport, isPending } = usePeriodReport();
  const setActive = usePopapStore((state) => state.setActive);
  const form = useForm<z.input<typeof ReportsPeriodSchema>>({
    resolver: zodResolver(ReportsPeriodSchema),
    defaultValues: {
      walletType: 'inskech',
    },
  });
  const onSubmit = (values: z.input<typeof ReportsPeriodSchema>) => {
    periodReport(values);
    setActive(false);
  };
  return (
    <SheetHeader>
      <SheetTitle>Формирование отчета</SheetTitle>
      <SheetDescription>
        Заполните поля для общего формирования отчёта по остаткам на конец
        периода
      </SheetDescription>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col justify-center"
        >
          <FormField
            control={form.control}
            name="walletType"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormLabel>Тип кошелька</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inskech">inskech</SelectItem>
                    <SelectItem value="bet11">bet11</SelectItem>
                    <SelectItem value="vnj">vnj</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">
            {' '}
            {isPending ? 'Загрузка...' : 'Получить отчет'}
          </Button>
        </form>
      </Form>
    </SheetHeader>
  );
}
