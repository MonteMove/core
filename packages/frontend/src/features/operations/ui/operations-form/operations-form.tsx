'use client';

import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

import { useApplicationsList } from '@/entities/application';
import {
  CreateOperationDto,
  CreateOperationDtoSchema,
  OperationResponseDto,
  useCreateOperation,
  useOperationTypes,
  useUpdateOperation,
  useWallets,
} from '@/entities/operations';
import {
  Button,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Textarea,
  cn,
  formatDate,
} from '@/shared';

export function OperationForm({
  initialData,
  className,
  ...props
}: { initialData?: OperationResponseDto } & React.ComponentProps<'form'>) {
  const createMutation = useCreateOperation();
  const updateMutation = useUpdateOperation();

  const [open, setOpen] = React.useState(false);
  const [rawInput, setRawInput] = React.useState('');

  const { data: wallets } = useWallets();
  const { data: operationTypes, isLoading: isOperationTypesLoading } =
    useOperationTypes();
  const { data: applications, isLoading: isApplicationsLoading } =
    useApplicationsList();

  const form = useForm<CreateOperationDto>({
    resolver: zodResolver(CreateOperationDtoSchema),
    defaultValues: initialData
      ? {
          typeId: initialData.typeId,
          applicationId: 0,
          description: initialData.description ?? '',
          entries: initialData.entries.map((e) => ({
            wallet: { id: e.wallet.id, name: e.wallet.name },
            direction: e.direction,
            amount: e.amount,
          })),
          creatureDate: initialData.createdAt,
        }
      : {
          typeId: '',
          applicationId: 0,
          description: '',
          entries: [],
          creatureDate: '',
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  const onSubmit = (data: CreateOperationDto) => {
    if (!data.creatureDate) {
      data.creatureDate = new Date().toISOString();
    }

    if (initialData) {
      // режим редактирования
      const mergedEntries = data.entries.map((entry) => {
        const oldEntry = initialData.entries.find(
          (e) =>
            e.wallet.id === entry.wallet.id && e.direction === entry.direction,
        );

        return {
          id: oldEntry?.id ?? crypto.randomUUID(),
          wallet: { id: entry.wallet.id, name: entry.wallet.name },
          direction: entry.direction,
          amount: entry.amount,
          before: oldEntry?.before ?? null,
          after: oldEntry?.after ?? null,
          userId: oldEntry?.userId ?? crypto.randomUUID(),
          updatedById: oldEntry?.updatedById ?? crypto.randomUUID(),
          createdAt: oldEntry?.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

      updateMutation.mutate({
        id: initialData.id,
        typeId: data.typeId,
        applicationId: data.applicationId,
        creatureDate: data.creatureDate,
        description: data.description ?? null,
        entries: mergedEntries,
      });
    } else {
      // создание
      createMutation.mutate(data);
    }
  };

  const isEditing = Boolean(initialData);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Тип операции */}
          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип операции:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isOperationTypesLoading && (
                      <SelectItem value="loading" disabled>
                        Загрузка...
                      </SelectItem>
                    )}
                    {operationTypes?.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Тип заявки */}
          <FormField
            control={form.control}
            name="applicationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип заявки:</FormLabel>
                {isApplicationsLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={String(field.value ?? '')}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {applications?.applications?.map((app) => (
                        <SelectItem key={app.id} value={String(app.id)}>
                          #{app.id} - {app.amount} {app.currency.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormItem>
            )}
          />

          {/* Дата */}
          <FormField
            control={form.control}
            name="creatureDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дата операции:</FormLabel>
                <div className="relative flex gap-2">
                  <FormControl>
                    <Input
                      value={rawInput}
                      placeholder="ДД.ММ.ГГГГ"
                      className="bg-background pr-10"
                      onChange={(e) => {
                        let raw = e.target.value.replace(/\D/g, '');
                        if (raw.length > 8) raw = raw.slice(0, 8);

                        let formatted = raw;
                        if (raw.length > 4)
                          formatted = `${raw.slice(0, 2)}.${raw.slice(2, 4)}.${raw.slice(4)}`;
                        else if (raw.length > 2)
                          formatted = `${raw.slice(0, 2)}.${raw.slice(2)}`;

                        setRawInput(formatted);

                        const parts = formatted.split('.');
                        if (parts.length === 3) {
                          const [dd, mm, yyyy] = parts.map(Number);
                          const parsed = new Date(yyyy, mm - 1, dd);
                          if (!isNaN(parsed.getTime())) {
                            field.onChange(parsed.toISOString());
                            return;
                          }
                        }

                        field.onChange(formatted);
                      }}
                    />
                  </FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                      >
                        <CalendarIcon className="size-3.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="end"
                    >
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date.toISOString());
                            setRawInput(formatDate(date));
                          }
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Entries */}
        <div className="lg:grid lg:grid-cols-2 gap-4">
          {['credit', 'debit'].map((dir) => (
            <div key={dir} className="flex flex-col gap-3 mt-2">
              <div className="lg:flex justify-between items-center">
                <p className="font-medium">
                  {dir === 'credit' ? 'Вычесть из...' : 'Прибавить к...'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() =>
                    append({
                      wallet: { id: '', name: '' },
                      direction: dir as 'credit' | 'debit',
                      amount: 0,
                    })
                  }
                >
                  + Добавить строку
                </Button>
              </div>

              {fields
                .filter((item) => item.direction === dir)
                .map((item, index) => (
                  <div key={item.id} className="flex gap-3 items-end">
                    <FormField
                      control={form.control}
                      name={`entries.${index}.wallet.id`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Кошелек</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ''}
                          >
                            <FormControl>
                              <SelectTrigger className="lg:w-[250px] w-full">
                                <SelectValue placeholder="Выберите" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {wallets?.wallets?.map((wallet) => (
                                <SelectItem key={wallet.id} value={wallet.id}>
                                  {wallet.name} — {wallet.amount}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`entries.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Сумма</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Описание */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  className="w-full h-[50px]"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {isEditing
            ? updateMutation.isPending
              ? 'Сохранение...'
              : 'Сохранить изменения'
            : createMutation.isPending
              ? 'Создание...'
              : 'Создать'}
        </Button>
      </form>
    </Form>
  );
}
