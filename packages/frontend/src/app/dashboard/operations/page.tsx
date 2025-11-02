"use client";

import { Fragment, useState } from "react";
import { useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Copy, Pencil, Search, Trash, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { GetOperationsParams, GetOperationsParamsSchema } from "@/entities/operations";
import { useOperationTypes } from "@/hooks/__mocks__/use-operation-type.mock";
import {
  useCopyOperation,
  useDeleteOperation,
  useInfiniteOperations,
  useUsers,
} from "@/hooks/__mocks__/use-operation-type.mock";
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
} from "@/shared";

export default function OperationsPage({ filters }: { filters?: GetOperationsParams }) {
  const form = useForm<GetOperationsParams>({
    resolver: zodResolver(GetOperationsParamsSchema),
    defaultValues: {
      typeId: null,
      userId: null,
      search: "",
      dateFrom: "",
      dateTo: "",
    },
  });
  const handleReset = () => {
    form.reset({
      search: "",
      typeId: null,
      userId: null,
      dateFrom: "",
      dateTo: "",
      page: 1,
      limit: 10,
    });
  };

  const router = useRouter();
  const { data, error, hasNextPage, isFetching, isLoading } = useInfiniteOperations(filters);
  const { data: operationTypes, isLoading: operationTypesLoading } = useOperationTypes();
  const { data: users } = useUsers();
  const { copyOperation } = useCopyOperation();
  const { mutate: deleteOperation } = useDeleteOperation(filters);
  const lastOperationRef = useRef<HTMLDivElement | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

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
      <form className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Операции</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between">
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem className="w-[200]">
                    <FormLabel>Поиск:</FormLabel>
                    <FormControl>
                      <div className="relative w-[250]">
                        <Input
                          type="search"
                          placeholder="Введите данные"
                          {...field}
                          className="pl-8 pr-8 w-[200] [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none"
                        />
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        {field.value && (
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                            onClick={() => form.setValue("search", "")}
                          ></button>
                        )}
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
                    <FormLabel>Период:</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[200] justify-start text-left font-normal",
                              !form.watch("dateFrom") && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="h-4 w-4" />
                            {form.watch("dateFrom") ? (
                              form.watch("dateTo") ? (
                                <>
                                  {format(new Date(form.watch("dateFrom")), "dd.MM.yyyy", {
                                    locale: ru,
                                  })}{" "}
                                  –{" "}
                                  {format(new Date(form.watch("dateTo")), "dd.MM.yyyy", {
                                    locale: ru,
                                  })}
                                </>
                              ) : (
                                format(new Date(form.watch("dateFrom")), "dd.MM.yyyy", {
                                  locale: ru,
                                })
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
                              from: form.watch("dateFrom")
                                ? new Date(form.watch("dateFrom"))
                                : undefined,
                              to: form.watch("dateTo") ? new Date(form.watch("dateTo")) : undefined,
                            }}
                            onSelect={(range) => {
                              if (!range) return;

                              if (range.from && !range.to) {
                                form.setValue("dateFrom", range.from.toISOString());
                                form.setValue("dateTo", undefined);
                                return;
                              }

                              if (range.from && range.to) {
                                form.setValue("dateFrom", range.from.toISOString());
                                form.setValue("dateTo", range.to.toISOString());
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
                  <FormItem className="w-[200] min-[450px]:col-span-2 lg:col-span-1">
                    <FormLabel>Тип операции</FormLabel>
                    {operationTypesLoading ? (
                      <Skeleton className="h-8" />
                    ) : (
                      <Select
                        onValueChange={(value) => field.onChange(value || null)}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger
                          className={cn("w-[200]", fieldState.error && "border-red-500")}
                        >
                          <SelectValue placeholder="Выбрать" />
                        </SelectTrigger>
                        <SelectContent>
                          {operationTypes?.map((operationType) => (
                            <SelectItem key={operationType.id} value={String(operationType.id)}>
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
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пользователь</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value || null)}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[200]">
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
                  className="lg:w-[200] lg:mt-0 mt-2 w-full"
                  type="button"
                  onClick={handleReset}
                >
                  Сбросить
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all">Все операции</TabsTrigger>
              <TabsTrigger value="deposit">Пополнение</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className={"flex flex-col gap-2"}>
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
                          activeTab === "deposit"
                            ? operation.type.name.toLowerCase().includes("попол")
                            : true
                        )
                        .map((operation, operationIndex) => {
                          const isLast =
                            pageIndex === data.pages.length - 1 &&
                            operationIndex === page.operations.length - 1;

                          const showDetails = expandedId === operation.id;

                          return (
                            <DropdownMenu key={operation.id}>
                              <DropdownMenuTrigger asChild>
                                <Card
                                  ref={isLast ? lastOperationRef : null}
                                  className="relative gap-2 mb-2 text-foreground"
                                  onTouchStart={(e) => {
                                    const timer = setTimeout(() => {
                                      e.currentTarget.click();
                                    }, 600);
                                    const cancel = () => clearTimeout(timer);
                                    e.currentTarget.addEventListener("touchend", cancel, {
                                      once: true,
                                    });
                                    e.currentTarget.addEventListener("touchmove", cancel, {
                                      once: true,
                                    });
                                  }}
                                >
                                  <CardHeader className="grid grid-cols-2">
                                    <p>
                                      <strong>Создатель: </strong>
                                      <span>{operation.created_by?.username}</span>
                                    </p>
                                    <p className="flex justify-end">
                                      <span>{operation.createdAt}</span>
                                    </p>
                                    <p>
                                      <strong>Операция: </strong>
                                      <span>{operation.type.name}</span>
                                    </p>
                                  </CardHeader>

                                  <CardContent className="grid grid-cols-2">
                                    <div className="flex flex-col gap-2 justify-between">
                                      {operation.entries.map((entry) => (
                                        <Card key={entry.id}>
                                          <CardContent>
                                            {showDetails ? (
                                              <>
                                                <div>
                                                  <strong>{entry.wallet.name}:</strong>
                                                </div>
                                                <div>
                                                  {entry.direction === "credit" ? (
                                                    <p>
                                                      <span>{entry.before} + </span>
                                                      <strong className="text-green-600/60 font-semibold">
                                                        {entry.amount}
                                                      </strong>
                                                      <span> = {entry.after}</span>
                                                    </p>
                                                  ) : (
                                                    <p>
                                                      <span>{entry.before} - </span>
                                                      <strong className="text-red-600/60 font-semibold">
                                                        {entry.amount}
                                                      </strong>
                                                      <span> = {entry.after}</span>
                                                    </p>
                                                  )}
                                                </div>
                                              </>
                                            ) : (
                                              // краткий вид
                                              <div>
                                                <strong>{entry.wallet.name}: </strong>
                                                <span>{entry.after}</span>
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  </CardContent>

                                  <CardFooter>
                                    <p className="col-span-4">
                                      <span className="block lg:inline">
                                        {operation.description || "Не указано"}
                                      </span>
                                    </p>
                                  </CardFooter>
                                </Card>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent
                                align="center"
                                className="w-40 bg-background shadow-md rounded-md text-foreground"
                              >
                                <DropdownMenuItem
                                  className="hover:bg-primary/60 dark:hover:bg-primary/60"
                                  onClick={() =>
                                    router.push(ROUTER_MAP.OPERATIONS_EDIT + "/" + operation.id)
                                  }
                                >
                                  <Pencil className="mr-2 h-4 w-4 text-primary" /> Редактировать
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="hover:bg-primary/60 dark:hover:bg-primary/60"
                                  onClick={() =>
                                    setExpandedId((prev) =>
                                      prev === operation.id ? null : operation.id
                                    )
                                  }
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                  {showDetails ? "Скрыть" : "Подробнее"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="hover:bg-primary/60 dark:hover:bg-primary/60"
                                  onClick={() => copyOperation(operation)}
                                >
                                  <Copy className="mr-2 h-4 w-4 text-primary" /> Копировать
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                                  onClick={() => deleteOperation(operation.id)}
                                >
                                  <Trash className="mr-2 h-4 w-4 text-destructive/60" /> Удалить
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
            {isFetching && hasNextPage && <p className="text-center py-4">Загрузка...</p>}
          </div>
        </div>
      </form>
    </Form>
  );
}
