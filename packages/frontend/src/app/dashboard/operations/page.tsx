'use client';

import { Fragment, useState } from 'react';
import { useRef } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Copy, FileText, Pencil, Trash } from 'lucide-react';
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Form,
  formatDateTime,
  Input,
  Loading,
  ROUTER_MAP,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/shared';
import { OperationsFiltersSheet } from '@/features/operations/ui/operations-filters/operations-filters-sheet';

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
  const { data: operationTypes } = useOperationTypes();
  const { copyOperation } = useCopyOperation();
  const { mutate: deleteOperation } = useDeleteOperation();
  const lastOperationRef = useRef<HTMLDivElement | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const tabTypes = operationTypes?.filter((type) => type.isSeparateTab) || [];

  const currentTypeId = form.watch('typeId');
  const activeTab = currentTypeId || 'all';

  return (
    <Form {...form}>
      <form className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-2xl">Операции</CardTitle>
            <div className="flex gap-2 items-center flex-wrap">
              <Input
                placeholder="Поиск..."
                value={form.watch('search') ?? ''}
                onChange={(e) => form.setValue('search', e.target.value || '')}
                className="w-full md:w-64"
              />
              <OperationsFiltersSheet form={form} onReset={handleReset} />
              <Button
                type="button"
                onClick={() => router.push(ROUTER_MAP.OPERATIONS_CREATE)}
                className="md:w-auto"
              >
                Создать операцию
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            if (val === 'all') {
              form.setValue('typeId', null);
            } else {
              form.setValue('typeId', val);
            }
          }}
        >
          <TabsList
            className="grid w-full"
            style={{
              gridTemplateColumns: `repeat(${1 + tabTypes.length}, minmax(0, 1fr))`,
            }}
          >
            <TabsTrigger value="all" className="w-full">
              Все операции
            </TabsTrigger>
            {tabTypes.map((type) => (
              <TabsTrigger key={type.id} value={type.id} className="w-full">
                {type.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="space-y-2">
          <div className="">
            {isLoading ? (
              <Loading />
            ) : error ? (
              <div className="justify-items-center">
                <Card className="h-[100] w-full p-0 justify-center items-center text-lg">
                  {/* <p className="text-destructive">Ошибка при загрузке: {error.message}</p> */}
                </Card>
              </div>
            ) : !data?.pages[0]?.operations.length ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText />
                  </EmptyMedia>
                  <EmptyContent>
                    <EmptyTitle>Операции не найдены</EmptyTitle>
                    <EmptyDescription>
                      Нет операций, соответствующих выбранным фильтрам.
                      Попробуйте изменить параметры поиска или создайте новую
                      операцию.
                    </EmptyDescription>
                  </EmptyContent>
                </EmptyHeader>
              </Empty>
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
                                                      {entry.before ?? 0} +{' '}
                                                    </span>
                                                    <span className="text-success/80 font-semibold">
                                                      {entry.amount}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                      {' '}
                                                      = {entry.after ?? 0}
                                                    </span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <span className="text-muted-foreground">
                                                      {entry.before ?? 0} -{' '}
                                                    </span>
                                                    <span className="text-destructive/80 font-semibold">
                                                      {entry.amount}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                      {' '}
                                                      = {entry.after ?? 0}
                                                    </span>
                                                  </>
                                                )}
                                              </p>
                                            ) : (
                                              <p className="text-sm">
                                                <span className="font-medium">
                                                  {entry.wallet.name}:{' '}
                                                </span>
                                                <span>{entry.after ?? 0}</span>
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
                                        {formatDateTime(operation.createdAt)}
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
          {isFetching && hasNextPage && <Loading className="py-4" />}
        </div>
      </form>
    </Form>
  );
}
