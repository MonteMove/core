'use client';

import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import {
  ApplicationService,
  useApplicationsList,
} from '@/entities/application';
import {
  CreateOperationBackendDto,
  CreateOperationDto,
  CreateOperationDtoSchema,
  OperationResponseDto,
  UpdateOperationBackendDto,
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
  FormDescription,
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
  SelectValue, Loading,
  Textarea,
  cn,
  formatDate,
} from '@/shared';
import {
  formatNumber,
  parseFormattedNumber,
} from '@/shared/lib/utils/format-number';

export function OperationForm({
  initialData,
  className,
  ...props
}: { initialData?: OperationResponseDto } & React.ComponentProps<'form'>) {
  const createMutation = useCreateOperation();
  const updateMutation = useUpdateOperation();

  const [open, setOpen] = React.useState(false);
  const [rawInput, setRawInput] = React.useState('');
  const [walletSearch, setWalletSearch] = React.useState('');

  const { data: wallets } = useWallets();
  const { data: operationTypes, isLoading: isOperationTypesLoading } =
    useOperationTypes();
  const { data: applications, isLoading: isApplicationsLoading } =
    useApplicationsList();

  // Получаем текущую заявку операции, если она есть (даже если завершена)
  const currentApplicationId = initialData?.applicationId;
  const { data: currentApplication } = useQuery({
    queryKey: ['application', currentApplicationId],
    queryFn: () =>
      currentApplicationId
        ? ApplicationService.getById(String(currentApplicationId))
        : null,
    enabled: !!currentApplicationId,
  });

  // Объединяем открытые заявки и текущую заявку (если она завершена)
  const availableApplications = React.useMemo(() => {
    const openApps = applications?.applications || [];

    // Если есть текущая заявка и её нет в списке открытых, добавляем её
    if (
      currentApplication &&
      !openApps.find((app) => app.id === currentApplication.id)
    ) {
      return [currentApplication, ...openApps];
    }

    return openApps;
  }, [applications, currentApplication]);

  const form = useForm<CreateOperationDto>({
    resolver: zodResolver(CreateOperationDtoSchema),
    defaultValues: initialData
      ? {
          typeId: initialData.typeId,
          applicationId: initialData.applicationId || undefined,
          description: initialData.description ?? '',
          entries: initialData.entries.map((e) => ({
            wallet: e.wallet,
            direction: e.direction,
            amount: e.amount,
          })),
          creatureDate: initialData.createdAt,
        }
      : {
          typeId: '',
          applicationId: undefined,
          description: '',
          entries: [],
          creatureDate: undefined,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  // Проверяем, является ли выбранный тип операции "Корректировкой"
  const selectedTypeId = form.watch('typeId');
  const selectedOperationType = operationTypes?.find(
    (type) => type.id === selectedTypeId,
  );
  const isCorrection = selectedOperationType?.name === 'Корректировка';

  // Для корректировки ограничиваем количество записей до 1
  React.useEffect(() => {
    if (isCorrection) {
      if (fields.length === 0) {
        // Если нет записей, добавляем одну пустую
        append({
          wallet: { id: '', name: '' },
          direction: 'debit',
          amount: 0,
        });
      } else if (fields.length > 1) {
        // Если больше одной записи, оставляем только первую
        while (fields.length > 1) {
          remove(fields.length - 1);
        }
      }
    }
  }, [isCorrection, fields.length, remove, append]);

  const onSubmit = (data: CreateOperationDto) => {
    if (!data.creatureDate) {
      data.creatureDate = new Date().toISOString();
    }

    const transformedEntries = data.entries.map((entry) => ({
      walletId: entry.wallet.id,
      direction: entry.direction,
      amount: entry.amount,
    }));

    const payload: CreateOperationBackendDto = {
      typeId: data.typeId,
      ...(data.applicationId &&
        data.applicationId > 0 && { applicationId: data.applicationId }),
      description: data.description ?? null,
      entries: transformedEntries,
      creatureDate: data.creatureDate,
    };

    if (initialData) {
      const mergedEntries = data.entries.map((entry) => {
        const oldEntry = initialData.entries.find(
          (e) =>
            e.wallet.id === entry.wallet.id && e.direction === entry.direction,
        );

        if (oldEntry) {
          return {
            id: oldEntry.id,
            walletId: entry.wallet.id,
            direction: entry.direction,
            amount: entry.amount,
          };
        } else {
          return {
            walletId: entry.wallet.id,
            direction: entry.direction,
            amount: entry.amount,
          };
        }
      });

      const updatePayload: { id: string } & UpdateOperationBackendDto = {
        id: initialData.id,
        typeId: data.typeId,
        ...(data.applicationId &&
          data.applicationId > 0 && { applicationId: data.applicationId }),
        creatureDate: data.creatureDate,
        description: data.description ?? null,
        entries: mergedEntries,
      };

      updateMutation.mutate(updatePayload);
    } else {
      createMutation.mutate(payload);
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
                <FormLabel>
                  Тип операции <span className="text-destructive">*</span>
                </FormLabel>
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

          {/* Заявка */}
          <FormField
            control={form.control}
            name="applicationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Заявка:</FormLabel>
                {isApplicationsLoading ? (
                  <Skeleton className="h-8" />
                ) : (
                  <Select
                    onValueChange={(v) =>
                      field.onChange(v ? Number(v) : undefined)
                    }
                    value={field.value ? String(field.value) : ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Не выбрано" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableApplications?.map((app) => (
                        <SelectItem key={app.id} value={String(app.id)}>
                          #{app.id} - {app.amount} {app.currency.code}
                          {app.status === 'done' && ' (завершена)'}
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
                <FormLabel>Дата операции</FormLabel>
                <div className="relative flex gap-2">
                  <FormControl>
                    <Input
                      value={rawInput}
                      placeholder="дд.мм.гггг"
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
                          // Создаем дату напрямую в UTC, чтобы избежать смещения часовых поясов
                          const parsed = new Date(Date.UTC(yyyy, mm - 1, dd));
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
                            // Создаем дату в UTC из выбранного дня, чтобы избежать смещения часовых поясов
                            const utcDate = new Date(
                              Date.UTC(
                                date.getFullYear(),
                                date.getMonth(),
                                date.getDate(),
                              ),
                            );
                            field.onChange(utcDate.toISOString());
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
        {isCorrection ? (
          // Для корректировки - одна строка: кошелек + сумма корректировки
          <div className="flex flex-col gap-3 mt-2">
            {fields.map((item, realIndex) => (
              <div key={item.id} className="flex gap-3 items-end">
                <FormField
                  control={form.control}
                  name={`entries.${realIndex}.wallet.id`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        Кошелек <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите кошелек" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <div className="px-2 pb-2">
                            <Input
                              placeholder="Поиск кошелька..."
                              value={walletSearch}
                              onChange={(e) => setWalletSearch(e.target.value)}
                              className="h-8"
                            />
                          </div>
                          {wallets?.wallets
                            ?.filter((wallet) =>
                              wallet.name
                                .toLowerCase()
                                .includes(walletSearch.toLowerCase()),
                            )
                            .map((wallet) => (
                              <SelectItem key={wallet.id} value={wallet.id}>
                                {wallet.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Скрытое поле направления - всегда credit для корректировки */}
                <FormField
                  control={form.control}
                  name={`entries.${realIndex}.direction`}
                  render={({ field }) => (
                    <input type="hidden" {...field} value="credit" />
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${realIndex}.amount`}
                  render={({ field }) => (
                    <FormItem className="w-[280px]">
                      <FormLabel>
                        Сумма <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          value={
                            typeof field.value === 'number'
                              ? formatNumber(field.value)
                              : String(field.value || '')
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            const parsed = parseFormattedNumber(value);
                            field.onChange(isNaN(parsed) ? 0 : parsed);
                          }}
                          placeholder="0"
                          inputMode="numeric"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        ) : (
          // Для обычных операций - две колонки
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
                  .map((item, realIndex) => ({ item, realIndex }))
                  .filter(({ item }) => item.direction === dir)
                  .map(({ item, realIndex }) => (
                    <div key={item.id} className="flex gap-3 items-end">
                      <FormField
                        control={form.control}
                        name={`entries.${realIndex}.wallet.id`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>
                              Кошелек{' '}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ''}
                            >
                              <FormControl>
                                <SelectTrigger className="lg:w-[250px] w-full">
                                  <SelectValue placeholder="Выберите кошелек" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <div className="px-2 pb-2">
                                  <Input
                                    placeholder="Поиск кошелька..."
                                    value={walletSearch}
                                    onChange={(e) =>
                                      setWalletSearch(e.target.value)
                                    }
                                    className="h-8"
                                  />
                                </div>
                                {wallets?.wallets
                                  ?.filter((wallet) =>
                                    wallet.name
                                      .toLowerCase()
                                      .includes(walletSearch.toLowerCase()),
                                  )
                                  .map((wallet) => (
                                    <SelectItem
                                      key={wallet.id}
                                      value={wallet.id}
                                    >
                                      {wallet.name} — {wallet.amount}{' '}
                                      {wallet.currency.code}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`entries.${realIndex}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Сумма <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || 0}
                                onChange={(e) => {
                                  const value = e.target.valueAsNumber;
                                  field.onChange(isNaN(value) ? 0 : value);
                                }}
                                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(realIndex)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}

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
