"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  GetApplicationsFilters,
  getApplicationsFiltersSchema,
  useSetApplicationQueryParam,
} from "@/entities/application";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared";
import { cn } from "@/shared/lib/utils";

const sortByOptions = [
  { value: "createdAt", label: "Дате создания" },
  { value: "meetingDate", label: "Дате встречи" },
];

const sortOrderOptions = [
  { value: "desc", label: "Сначала новые" },
  { value: "asc", label: "Сначала старые" },
];

const statusApplications = [
  { value: "all", label: "Все" },
  { value: "open", label: "В работе" },
  { value: "done", label: "Завершена" },
];

export function ApplicationsFilters({ className, ...props }: React.ComponentProps<"div">) {
  const { setAllQueryParams } = useSetApplicationQueryParam();

  const form = useForm<z.input<typeof getApplicationsFiltersSchema>>({
    resolver: zodResolver(getApplicationsFiltersSchema),
    defaultValues: {
      search: "",
      status: "all",
      sortField: "createdAt",
      sortOrder: "desc",
      page: 1,
      limit: 10,
    },
  });

  const search = useWatch({ control: form.control, name: "search" });
  const status = useWatch({ control: form.control, name: "status" });
  const sortField = useWatch({ control: form.control, name: "sortField" });
  const sortOrder = useWatch({ control: form.control, name: "sortOrder" });

  useEffect(() => {
    const currentValues = {
      search: search || undefined,
      status: status === "all" ? undefined : status,
      sortField: sortField || undefined,
      sortOrder: sortOrder || undefined,
      page: 1,
      limit: 10,
    };

    setAllQueryParams(currentValues);
  }, [search, status, sortField, sortOrder, setAllQueryParams]);

  const handleReset = () => {
    form.reset({
      search: "",
      status: "all",
      sortField: "createdAt",
      sortOrder: "desc",
      page: 1,
      limit: 10,
    });
    setAllQueryParams({
      search: undefined,
      status: "all",
      sortField: undefined,
      sortOrder: undefined,
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Form {...form}>
        <form>
          <div className="lg:flex justify-center max-xl:flex-wrap md:items-end lg:gap-4">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Поиск:</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        type="search"
                        placeholder="Введите данные"
                        {...field}
                        className="pl-8 pr-8 w-full [appearance:textfield] [&::-webkit-search-cancel-button]:appearance-none"
                      />
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      {field.value && (
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                          onClick={() => form.setValue("search", "")}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="lg:mt-0 mt-2">Статус:</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="lg:w-[160px] w-full">
                        <SelectValue placeholder="По умолчанию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusApplications.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sortField"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="lg:mt-0 mt-2">Сортировать по:</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="lg:w-[150px] w-full">
                        <SelectValue placeholder="Все" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sortByOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="lg:mt-0 mt-2">Порядок:</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="lg:w-[170px] w-full">
                        <SelectValue placeholder="По умолчанию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sortOrderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button
              className="lg:w-[200px] lg:mt-0 mt-2 w-full"
              type="button"
              onClick={handleReset}
            >
              Сбросить
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
