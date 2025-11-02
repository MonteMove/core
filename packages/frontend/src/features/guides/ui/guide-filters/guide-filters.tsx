"use client";

import { useEffect, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  GetGuidesParamsRequest,
  GetGuidesParamsSchema,
} from "@/entities/guides/model/guide-schemas";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/shadcn/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/shared/ui/shadcn/form";
import { Input } from "@/shared/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/shadcn/select";

const sortByOptions = [
  { value: "createdAt", label: "Дате создания" },
  { value: "updatedAt", label: "Дате обновления" },
  { value: "fullName", label: "Имени" },
  { value: "phone", label: "Телефону" },
  { value: "address", label: "Адресу" },
];

const sortOrderOptions = [
  { value: "desc", label: "По убыванию" },
  { value: "asc", label: "По возрастанию" },
];

export function GuidesFilters({
  className,
  onFiltersChange,
  ...props
}: React.ComponentProps<"div"> & {
  onFiltersChange?: (filters: Partial<GetGuidesParamsRequest>) => void;
}) {
  const form = useForm<z.input<typeof GetGuidesParamsSchema>>({
    resolver: zodResolver(GetGuidesParamsSchema),
    defaultValues: {
      search: "",
      sortField: "createdAt",
      sortOrder: "desc",
      page: 1,
      limit: 10,
    },
  });

  const search = form.watch("search");
  const sortField = form.watch("sortField");
  const sortOrder = form.watch("sortOrder");
  const prevValues = useRef({ search, sortField, sortOrder });

  useEffect(() => {
    const current = { search, sortField, sortOrder };
    if (JSON.stringify(prevValues.current) !== JSON.stringify(current)) {
      onFiltersChange?.(current);
      prevValues.current = current;
    }
  }, [search, sortField, sortOrder, onFiltersChange]);

  const handleReset = () => {
    form.reset({
      search: search,
      sortField: "createdAt",
      sortOrder: "desc",
      page: 1,
      limit: 10,
    });
  };

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <Form {...form}>
        <form>
          <div className="lg:flex max-xl:flex-wrap md:items-end lg:gap-4">
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
              name="sortField"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="lg:mt-0 mt-2">Сортировать по:</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="lg:w-[200px] w-full">
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
                      <SelectTrigger className="lg:w-[200px] w-full">
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
