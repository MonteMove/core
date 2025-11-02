"use client";

import { useCallback, useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCurrency } from "@/entities/currency/model/use-currency";
import { useNetworkTypes } from "@/entities/network/model/use-network-types";
import { useNetworks } from "@/entities/network/model/use-networks";
import {
  BalanceStatus,
  CreateWalletFormValues,
  CreateWalletRequest,
  CreateWalletSchema,
  WalletKind,
  WalletType,
} from "@/entities/wallet";
import { useCreateWallet } from "@/features/wallets/hooks/use-create-wallet";

import { Button } from "../../../../shared/ui/shadcn/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../shared/ui/shadcn/form";
import { Input } from "../../../../shared/ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../shared/ui/shadcn/select";
import { Switch } from "../../../../shared/ui/shadcn/switch";
import { Textarea } from "../../../../shared/ui/shadcn/textarea";

const BALANCE_STATUS_LABELS: Record<BalanceStatus, string> = {
  [BalanceStatus.unknown]: "Неизвестно",
  [BalanceStatus.positive]: "Положительный",
  [BalanceStatus.negative]: "Отрицательный",
  [BalanceStatus.neutral]: "Нейтральный",
};

const WALLET_KIND_LABELS: Record<WalletKind, string> = {
  [WalletKind.simple]: "Простой",
  [WalletKind.crypto]: "Криптовалютный",
  [WalletKind.bank]: "Банковский",
};

const WALLET_TYPE_LABELS: Record<WalletType, string> = {
  [WalletType.inskech]: "Инскеш",
  [WalletType.bet11]: "Bet11",
  [WalletType.vnj]: "ВНЖ",
};

export function CreateWalletForm() {
  const createWalletMutation = useCreateWallet();
  const { data: currenciesData, isLoading: isCurrenciesLoading } = useCurrency();
  const { data: networksData, isLoading: isNetworksLoading } = useNetworks();

  const form = useForm<CreateWalletFormValues>({
    resolver: zodResolver(CreateWalletSchema),
    defaultValues: {
      name: "",
      description: "",
      amount: 0,
      balanceStatus: BalanceStatus.unknown,
      walletKind: WalletKind.simple,
      walletType: WalletType.inskech,
      currencyId: "",
      active: true,
      pinOnMain: false,
      pinned: false,
      visible: true,
      details: undefined,
    },
  });

  const walletKind = form.watch("walletKind");
  const selectedNetworkId = form.watch("details.networkId") ?? "";

  const { data: networkTypesData, isLoading: isNetworkTypesLoading } = useNetworkTypes(
    selectedNetworkId || undefined
  );

  const currencies = useMemo(() => currenciesData?.currencies ?? [], [currenciesData]);
  const networks = useMemo(() => networksData?.networks ?? [], [networksData]);
  const networkTypes = useMemo(() => networkTypesData?.networkTypes ?? [], [networkTypesData]);

  type WalletDetailsKeys = keyof NonNullable<CreateWalletRequest["details"]>;

  const clearDetailFields = useCallback(
    (fields: WalletDetailsKeys[]) => {
      fields.forEach((field) => {
        form.setValue(`details.${field}` as const, undefined, {
          shouldValidate: false,
          shouldDirty: false,
        });
      });
    },
    [form]
  );

  useEffect(() => {
    if (walletKind === WalletKind.simple) {
      clearDetailFields([
        "ownerFullName",
        "card",
        "phone",
        "address",
        "exchangeUid",
        "networkId",
        "networkTypeId",
      ]);
      return;
    }

    if (walletKind === WalletKind.bank) {
      clearDetailFields(["address", "exchangeUid", "networkId", "networkTypeId"]);
      return;
    }

    if (walletKind === WalletKind.crypto) {
      clearDetailFields(["ownerFullName", "card", "phone"]);
    }
  }, [walletKind, clearDetailFields]);

  const isCrypto = walletKind === WalletKind.crypto;
  const isBank = walletKind === WalletKind.bank;

  const onSubmit = (values: CreateWalletFormValues) => {
    const payload: CreateWalletRequest = CreateWalletSchema.parse(values);
    createWalletMutation.mutate(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input placeholder="Введите название" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input
                    {...field}
                    value={
                      typeof field.value === "number" || typeof field.value === "string"
                        ? field.value
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Добавьте краткое описание"
                  {...field}
                  value={field.value ?? ""}
                  rows={4}
                />
              </FormControl>
              <FormDescription>Не обязательно, до 2000 символов.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="balanceStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Статус баланса</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(BalanceStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {BALANCE_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="walletKind"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Вид кошелька</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите вид" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(WalletKind).map((kind) => (
                      <SelectItem key={kind} value={kind}>
                        {WALLET_KIND_LABELS[kind]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="walletType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип кошелька</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(WalletType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {WALLET_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите валюту" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isCurrenciesLoading && (
                      <SelectItem value="loading" disabled>
                        Загрузка...
                      </SelectItem>
                    )}
                    {currencies.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>
                        {currency.code} — {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isBank && (
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="details.ownerFullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Владелец карты <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="ФИО владельца" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details.card"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Номер карты <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="XXXX XXXX XXXX XXXX" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Например +79991234567"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {isCrypto && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="details.address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Адрес кошелька <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Введите адрес кошелька"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="details.networkId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Сеть <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue("details.networkTypeId", "");
                      }}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите сеть" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isNetworksLoading && (
                          <SelectItem value="loading" disabled>
                            Загрузка...
                          </SelectItem>
                        )}
                        {networks.map((network) => (
                          <SelectItem key={network.id} value={network.id}>
                            {network.code} — {network.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="details.networkTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Тип сети <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      disabled={!selectedNetworkId || isNetworkTypesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип сети" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isNetworkTypesLoading && (
                          <SelectItem value="loading" disabled>
                            Загрузка...
                          </SelectItem>
                        )}
                        {networkTypes.map((networkType) => (
                          <SelectItem key={networkType.id} value={networkType.id}>
                            {networkType.code} — {networkType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="details.exchangeUid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UID биржи</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Идентификатор на бирже"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Активный</FormLabel>
                  <FormDescription>Доступен для операций.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visible"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Отображать</FormLabel>
                  <FormDescription>Показывать в списках кошельков.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pinOnMain"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Закрепить на главной</FormLabel>
                  <FormDescription>Отображать в быстром доступе.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pinned"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Закреплённый кошелек</FormLabel>
                  <FormDescription>Отмечать как избранный.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:justify-end">
          <Button type="submit" className="md:w-fit" disabled={createWalletMutation.isPending}>
            {createWalletMutation.isPending ? "Создание..." : "Создать кошелек"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="md:w-fit"
            disabled={createWalletMutation.isPending}
            onClick={() => form.reset()}
          >
            Сбросить
          </Button>
        </div>
      </form>
    </Form>
  );
}
