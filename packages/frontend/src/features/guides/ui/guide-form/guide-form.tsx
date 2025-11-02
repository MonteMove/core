"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { CreateGuideRequest, CreateGuideSchema, GuideResponse } from "@/entities/guides";
import { useCreateGuide, useUpdateGuide } from "@/features/guides/hooks/use-guide";
import {
  findPhoneRule,
  formatByRule,
  formatCardNumber,
  formatDate,
  normalizeDigits,
} from "@/shared/lib/utils";
import { cn } from "@/shared/lib/utils";

import { Button } from "../../../../shared/ui/shadcn/button";
import { Calendar } from "../../../../shared/ui/shadcn/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../shared/ui/shadcn/form";
import { Input } from "../../../../shared/ui/shadcn/input";
import { Popover, PopoverContent } from "../../../../shared/ui/shadcn/popover";
import { Textarea } from "../../../../shared/ui/shadcn/textarea";

export function GuideForm({
  initialData,
  className,
  ...props
}: { initialData?: GuideResponse } & React.ComponentProps<"form">) {
  const createMutation = useCreateGuide();
  const updateMutation = useUpdateGuide();

  const form = useForm<CreateGuideRequest>({
    resolver: zodResolver(CreateGuideSchema),
    defaultValues: initialData
      ? {
          fullName: initialData.fullName ?? "",
          birthDate: initialData.birthDate ?? "",
          address: initialData.address ?? "",
          phone: initialData.phone ?? "",
          cardNumber: initialData.cardNumber ?? "",
          description: initialData.description ?? "",
        }
      : {
          fullName: "",
          birthDate: "",
          address: "",
          phone: "",
          cardNumber: "",
          description: "",
        },
  });

  const onSubmit = (data: CreateGuideRequest) => {
    if (initialData) {
      updateMutation.mutate({ id: initialData.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    initialData?.birthDate ? new Date(initialData.birthDate) : undefined
  );
  const [month, setMonth] = React.useState<Date | undefined>(date);

  useEffect(() => {
    if (initialData) {
      form.reset({
        fullName: initialData.fullName ?? "",
        birthDate: initialData.birthDate ?? "",
        address: initialData.address ?? "",
        phone: initialData.phone ?? "",
        cardNumber: initialData.cardNumber ?? "",
        description: initialData.description ?? "",
      });
      if (initialData.birthDate) {
        const initialDate = new Date(initialData.birthDate);
        setDate(initialDate);
        setMonth(initialDate);
      }
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="relative max-w-full">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-5 gap-y-4 flex flex-col">
            <div>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ФИО</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата рождения</FormLabel>
                    <div className="flex flex-col gap-3">
                      <div className="relative flex gap-2">
                        <FormControl>
                          <Input
                            value={date ? formatDate(date) : ""}
                            placeholder="Выберите дату"
                            className={cn("bg-background pr-10")}
                            readOnly
                          />
                        </FormControl>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                            >
                              <CalendarIcon className="size-3.5" />
                              <span className="sr-only">Выбрать дату</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="end"
                            alignOffset={-8}
                            sideOffset={10}
                          >
                            <Calendar
                              mode="single"
                              selected={date}
                              captionLayout="dropdown"
                              locale={ru}
                              month={month}
                              onMonthChange={setMonth}
                              onSelect={(newDate) => {
                                setDate(newDate ?? undefined);
                                setMonth(newDate ?? undefined);
                                setOpen(false);
                                field.onChange(newDate ? newDate.toISOString() : "");
                              }}
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="lg:col-span-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  const rule = findPhoneRule(field.value ?? "");
                  return (
                    <FormItem>
                      <FormLabel>Номер телефона</FormLabel>
                      <FormControl>
                        <Input
                          value={formatByRule(field.value)}
                          onChange={(e) => {
                            const normalized = normalizeDigits(e.target.value);
                            field.onChange(normalized);
                          }}
                          placeholder={rule?.example ?? "+XXX XX XXX XX XX"}
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
            <div>
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Номер карты</FormLabel>
                    <FormControl>
                      <Input
                        value={formatCardNumber(field.value)}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/[^\d]/g, "").slice(0, 16);
                          field.onChange(digitsOnly);
                        }}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        inputMode="numeric"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="lg:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea className={cn("mt-[5] h-[250]")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="lg:col-span-2">
              <Button
                type="submit"
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Сохраняем..."
                  : initialData
                    ? "Сохранить"
                    : "Создать"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
