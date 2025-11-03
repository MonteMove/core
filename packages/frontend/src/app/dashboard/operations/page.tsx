'use client';

import { Fragment, useState } from 'react';
import { useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon, Copy, Pencil, Search, Trash, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { useApplicationsList } from '@/entities/application';
import {
  GetOperationsParams,
  GetOperationsParamsSchema,
  useCopyOperation,
  useDeleteOperation,
  useInfiniteOperations,
  useOperationTypes,
} from '@/entities/operations';
import { useUsers } from '@/entities/users';
import {
  Button,
  Calendar,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
  ROUTER_MAP,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  cn,
} from '@/shared';

export default function OperationsPage() {
  const form = useForm<GetOperationsParams>({
    resolver: zodResolver(GetOperationsParamsSchema),
    defaultValues: {
      typeId: null,
      userId: null,
      applicationId: null,
      search: '',
      dateFrom: '',
      dateTo: '',
    },
  });
  const handleReset = () => {
    form.reset({
      search: '',
      typeId: null,
      userId: null,
      applicationId: null,
      dateFrom: '',
      dateTo: '',
      page: 1,
      limit: 10,
    });
  };

  const router = useRouter();
  const { data, error, hasNextPage, isFetching, isLoading } =
    useInfiniteOperations();
  const { data: operationTypes, isLoading: operationTypesLoading } =
    useOperationTypes();
  const { data: applications, isLoading: applicationsLoading } =
    useApplicationsList();
  const { data: users } = useUsers();
  const { copyOperation } = useCopyOperation();
  const { mutate: deleteOperation } = useDeleteOperation();
  const lastOperationRef = useRef<HTMLDivElement | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const [open, setOpen] = useState(false);

  // const searchValue = form.watch("search");

  // useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     form.setValue("page", 1);
  //     form.handleSubmit((values) => {
  //     })();
  //   }, 400);

  //   return () => clearTimeout(delayDebounce);
  // }, [form.watch("search")]);

  return (
    <Form {...form}>
      <form className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-2xl">Операции</CardTitle>
            <Button
              type="button"
              onClick={() => router.push(ROUTER_MAP.OPERATIONS_CREATE)}
              className="md:w-auto"
            >
              Создать операцию
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Поиск</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="search"
                          placeholder="Введите данные"
                          {...field}
                          className="pl-8 [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none"
                        />
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateFrom"
                render={() => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Период</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !form.watch('dateFrom') &&
                                'text-muted-foreground',
                            )}
                          >
                            <CalendarIcon className="h-4 w-4" />
                            {form.watch('dateFrom') ? (
                              form.watch('dateTo') ? (
                                <>
                                  {form.watch('dateFrom') &&
                                    format(
                                      new Date(form.watch('dateFrom')!),
                                      'dd.MM.yyyy',
                                      {
                                        locale: ru,
                                      },
                                    )}{' '}
                                  –{' '}
                                  {form.watch('dateTo') &&
                                    format(
                                      new Date(form.watch('dateTo')!),
                                      'dd.MM.yyyy',
                                      {
                                        locale: ru,
                                      },
                                    )}
                                </>
                              ) : (
                                form.watch('dateFrom') &&
                                format(
                                  new Date(form.watch('dateFrom')!),
                                  'dd.MM.yyyy',
                                  {
                                    locale: ru,
                                  },
                                )
                              )
                            ) : (
                              <span>Выбрать даты</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent
                        align="start"
                        sideOffset={4}
                        className="p-0 w-auto bg-white border rounded-xl shadow-lg z-50 overflow-hidden"
                      >
                        <div className="bg-white">
                          <Calendar
                            mode="range"
                            numberOfMonths={2}
                            selected={{
                              from: form.watch('dateFrom')
                                ? new Date(form.watch('dateFrom')!)
                                : undefined,
                              to: form.watch('dateTo')
                                ? new Date(form.watch('dateTo')!)
                                : undefined,
                            }}
                            onSelect={(range) => {
                              if (!range) return;

                              if (range.from && !range.to) {
                                form.setValue(
                                  'dateFrom',
                                  range.from.toISOString(),
                                );
                                form.setValue('dateTo', undefined);
                                return;
                              }

                              if (range.from && range.to) {
                                form.setValue(
                                  'dateFrom',
                                  range.from.toISOString(),
                                );
                                form.setValue('dateTo', range.to.toISOString());
                                setOpen(false);
                              }
                            }}
                            locale={ru}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="typeId"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Тип операции</FormLabel>
                    {operationTypesLoading ? (
                      <Skeleton className="h-8" />
                    ) : (
                      <Select
                        onValueChange={(value) => field.onChange(value || null)}
                        value={field.value ?? ''}
                      >
                        <SelectTrigger
                          className={cn(
                            'w-full',
                            fieldState.error && 'border-red-500',
                          )}
                        >
                          <SelectValue placeholder="Выбрать" />
                        </SelectTrigger>
                        <SelectContent>
                          {operationTypes?.map((operationType) => (
                            <SelectItem
                              key={operationType.id}
                              value={String(operationType.id)}
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
                name="applicationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Заявка</FormLabel>
                    {applicationsLoading ? (
                      <Skeleton className="h-8" />
                    ) : (
                      <Select
                        onValueChange={(value) => field.onChange(value || null)}
                        value={field.value ?? ''}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выбрать" />
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пользователь</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value || null)}
                      value={field.value ?? ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выбрать" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users?.users?.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={handleReset}
                >
                  Сбросить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="all">Все операции</TabsTrigger>
            <TabsTrigger value="deposit">Пополнение</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          <div className="">
            {isLoading ? (
              <div className="flex flex-col gap-2">
                {new Array(5).fill(null).map((_, i) => (
                  <Card key={i} className="h-[176] w-full p-0">
                    <Skeleton className="h-[176] w-full"></Skeleton>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="justify-items-center">
                <Card className="h-[100] w-full p-0 justify-center items-center text-lg">
                  {/* <p className="text-destructive">Ошибка при загрузке: {error.message}</p> */}
                </Card>
              </div>
            ) : !data?.pages[0]?.operations.length ? (
              <div className="justify-items-center">
                <Card className="h-[100] w-full p-0 justify-center items-center text-lg">
                  <strong>Операции не найдены.</strong>
                </Card>
              </div>
            ) : (
              <div>
                {data?.pages.map((page, pageIndex) => (
                  <Fragment key={pageIndex}>
                    {page.operations
                      .filter((operation) =>
                        activeTab === 'deposit'
                          ? operation.type.name.toLowerCase().includes('попол')
                          : true,
                      )
                      .map((operation, operationIndex) => {
                        const isLast =
                          pageIndex === data.pages.length - 1 &&
                          operationIndex === page.operations.length - 1;

                        const showDetails = expandedIds.includes(operation.id);

                        return (
                          <DropdownMenu key={operation.id}>
                            <DropdownMenuTrigger asChild>
                              <Card
                                ref={isLast ? lastOperationRef : null}
                                className="relative cursor-pointer hover:bg-accent/50 transition-colors mb-2"
                                onTouchStart={(e) => {
                                  const timer = setTimeout(() => {
                                    e.currentTarget.click();
                                  }, 600);
                                  const cancel = () => clearTimeout(timer);
                                  e.currentTarget.addEventListener(
                                    'touchend',
                                    cancel,
                                    {
                                      once: true,
                                    },
                                  );
                                  e.currentTarget.addEventListener(
                                    'touchmove',
                                    cancel,
                                    {
                                      once: true,
                                    },
                                  );
                                }}
                              >
                                <CardContent className="py-0">
                                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-2 flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-semibold">
                                          {operation.type.name}
                                        </p>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {operation.created_by?.username}
                                      </p>

                                      <div className="space-y-1.5">
                                        {operation.entries.map((entry) => (
                                          <div
                                            key={entry.id}
                                            className="p-2 rounded-md bg-muted/50"
                                          >
                                            {showDetails ? (
                                              <p className="text-sm">
                                                <span className="font-medium">
                                                  {entry.wallet.name}:{' '}
                                                </span>
                                                {entry.direction ===
                                                'credit' ? (
                                                  <>
                                                    <span className="text-muted-foreground">
                                                      {entry.before} +{' '}
                                                    </span>
                                                    <span className="text-emerald-600 font-semibold">
                                                      {entry.amount}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                      {' '}
                                                      = {entry.after}
                                                    </span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <span className="text-muted-foreground">
                                                      {entry.before} -{' '}
                                                    </span>
                                                    <span className="text-red-600 font-semibold">
                                                      {entry.amount}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                      {' '}
                                                      = {entry.after}
                                                    </span>
                                                  </>
                                                )}
                                              </p>
                                            ) : (
                                              <p className="text-sm">
                                                <span className="font-medium">
                                                  {entry.wallet.name}:{' '}
                                                </span>
                                                <span>{entry.after}</span>
                                              </p>
                                            )}
                                          </div>
                                        ))}
                                      </div>

                                      {operation.description && (
                                        <p className="text-sm text-muted-foreground">
                                          {operation.description}
                                        </p>
                                      )}
                                    </div>

                                    <div className="text-left sm:text-right">
                                      <p className="text-sm text-muted-foreground">
                                        {operation.createdAt}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="center"
                              className="w-40 bg-background shadow-md rounded-md text-foreground"
                            >
                              <DropdownMenuItem
                                className="hover:bg-primary/60 dark:hover:bg-primary/60"
                                onClick={() =>
                                  router.push(
                                    ROUTER_MAP.OPERATIONS_EDIT +
                                      '/' +
                                      operation.id,
                                  )
                                }
                              >
                                <Pencil className="mr-2 h-4 w-4 text-primary" />{' '}
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:bg-primary/60 dark:hover:bg-primary/60"
                                onClick={() =>
                                  setExpandedIds((prev) =>
                                    prev.includes(operation.id)
                                      ? prev.filter((id) => id !== operation.id)
                                      : [...prev, operation.id],
                                  )
                                }
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                {showDetails ? 'Скрыть' : 'Подробнее'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="hover:bg-primary/60 dark:hover:bg-primary/60"
                                onClick={() => copyOperation(operation)}
                              >
                                <Copy className="mr-2 h-4 w-4 text-primary" />{' '}
                                Копировать
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                                onClick={() => deleteOperation(operation.id)}
                              >
                                <Trash className="mr-2 h-4 w-4 text-destructive/60" />{' '}
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        );
                      })}
                  </Fragment>
                ))}
              </div>
            )}
          </div>
          {isFetching && hasNextPage && (
            <p className="text-center py-4">Загрузка...</p>
          )}
        </div>
      </form>
    </Form>
  );
}
