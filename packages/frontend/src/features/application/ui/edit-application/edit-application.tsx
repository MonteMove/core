import { useEffect } from 'react';
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  ApplicationResponse,
  CreateApplicationRequest,
  CreateApplicationRequestSchema,
  DateTimePicker,
  useUpdateApplication,
} from '@/entities/application';
import { useCurrency } from '@/entities/currency';
import { useOperationTypes } from '@/entities/operations';
import { useCouriers } from '@/entities/users';
import {
  cn,
  findPhoneRule,
  formatByRule,
  normalizeDigits,
} from '@/shared/lib/utils';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcn/form';
import { Input } from '@/shared/ui/shadcn/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select';
import { Separator } from '@/shared/ui/shadcn/separator';
import { Skeleton } from '@/shared/ui/shadcn/skeleton';
import { Textarea } from '@/shared/ui/shadcn/textarea';

const formatTelegramUsername = (value: string): string => {
  return value
    .replace(/@/g, '')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .substring(0, 32);
};

export function EditApplicationForm({
  initialData,
}: { initialData?: ApplicationResponse } & React.ComponentProps<'form'>) {
  const { data: operationTypes, isLoading: operationTypesLoading } =
    useOperationTypes();
  const { data: couriers, isLoading: couriersLoading } = useCouriers();
  const { data: currency, isLoading: currencyLoading } = useCurrency();
  const updateMutation = useUpdateApplication();

  const form = useForm<CreateApplicationRequest>({
    resolver: zodResolver(CreateApplicationRequestSchema),
    defaultValues: initialData
      ? {
          currencyId: initialData.currencyId ?? '',
          operationTypeId: initialData.operationTypeId ?? '',
          assigneeUserId: initialData.assigneeUserId ?? '',
          description: initialData.description ?? '',
          amount: initialData.amount ?? 0,
          telegramUsername: initialData.telegramUsername
            ? initialData.telegramUsername.replace('@', '')
            : '',
          phone: initialData.phone ?? '',
          meetingDate: initialData.meetingDate ?? '',
        }
      : {
          currencyId: '',
          operationTypeId: '',
          assigneeUserId: '',
          description: '',
          amount: 0,
          telegramUsername: '',
          phone: '',
          meetingDate: undefined,
        },
  });

  const onSubmit = (data: CreateApplicationRequest) => {
    const formData = {
      ...data,
      telegramUsername: data.telegramUsername
        ? `@${data.telegramUsername}`
        : '',
    };

    if (initialData) {
      updateMutation.mutate({ id: initialData.id.toString(), ...formData });
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        currencyId: initialData.currencyId ?? '',
        operationTypeId: initialData.operationTypeId ?? '',
        assigneeUserId: initialData.assigneeUserId ?? '',
        description: initialData.description ?? '',
        amount: initialData.amount ?? 0,
        telegramUsername: initialData.telegramUsername
          ? initialData.telegramUsername.replace('@', '')
          : '',
        phone: initialData.phone ?? '',
        meetingDate: initialData.meetingDate ?? '',
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col ">
          <div className="grid lg:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="assigneeUserId"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Исполнитель</FormLabel>

                  {couriersLoading ? (
                    <Skeleton className="h-8" />
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите исполнителя" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {couriers?.map((couriers) => (
                          <SelectItem key={couriers.id} value={couriers.id}>
                            {couriers.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="meetingDate"
              render={({ field, fieldState }) => (
                <FormItem className="flex flex-col  w-full">
                  <FormLabel>Дата и время встречи</FormLabel>
                  <DateTimePicker
                    value={field.value}
                    onChange={field.onChange}
                    className={cn(
                      'max-sm:flex-col max-sm:items-stretch',
                      fieldState.error && '*:border-red-500 *:border-2',
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-6" />
          <div className="grid  min-[450px]:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="operationTypeId"
              render={({ field, fieldState }) => (
                <FormItem className="w-full min-[450px]:col-span-2 lg:col-span-1">
                  <FormLabel>Тип операции</FormLabel>
                  {operationTypesLoading ? (
                    <Skeleton className="h-8" />
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger
                        className={cn(
                          'w-full',
                          fieldState.error && 'border-red-500',
                        )}
                      >
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        {operationTypes?.map((operationType) => (
                          <SelectItem
                            key={operationType.id}
                            value={operationType.id}
                          >
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
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сумма</FormLabel>
                  <FormControl className="w-full">
                    <Input
                      type="number"
                      placeholder="1000"
                      {...field}
                      value={field.value === undefined ? '' : field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currencyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Валюта</FormLabel>
                  {currencyLoading ? (
                    <Skeleton className="h-8" />
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите валюту" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currency?.currencies.map((currency) => (
                          <SelectItem key={currency.id} value={currency.id}>
                            {currency.name} ({currency.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-6" />

          <div className="grid grid-cols-1  min-[450px]:grid-cols-2 gap-4 ">
            <FormField
              control={form.control}
              name="telegramUsername"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Имя пользователя (Telegram)</FormLabel>
                  <div className="flex rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <span className="flex items-center px-3 text-muted-foreground bg-muted border-r">
                      @
                    </span>
                    <Input
                      placeholder="username"
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                      value={field.value}
                      onChange={(e) => {
                        const formattedValue = formatTelegramUsername(
                          e.target.value,
                        );
                        field.onChange(formattedValue);
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pastedText = e.clipboardData.getData('text');
                        const formattedValue =
                          formatTelegramUsername(pastedText);
                        field.onChange(formattedValue);
                      }}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => {
                const rule = findPhoneRule(field.value ?? '');
                return (
                  <FormItem className="col-span-1 self-end">
                    <FormLabel>Номер телефона</FormLabel>
                    <FormControl>
                      <Input
                        value={formatByRule(field.value)}
                        onChange={(e) => {
                          const normalized = normalizeDigits(e.target.value);
                          field.onChange(normalized);
                        }}
                        placeholder={rule?.example ?? '+XXX XX XXX XX XX'}
                        inputMode="numeric"
                        maxLength={20}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <Separator className="my-6" />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Описание</FormLabel>
                <Textarea placeholder="Описание" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full cursor-pointer"
        >
          {updateMutation.isPending ? 'Сохраняем...' : 'Сохранить'}
        </Button>
      </form>
    </Form>
  );
}
