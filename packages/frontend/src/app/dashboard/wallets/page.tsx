'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Wallet as WalletIcon } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

import {
  BankWalletCard,
  CryptoWalletCard,
  GetWalletsFilter,
  GetWalletsFilterSchema,
  Wallet,
  WalletCardSkeleton,
  SimpleWalletCard,
  SortOrder,
  WalletSortField,
  useWallets,
} from '@/entities/wallet';
import { useWalletTypes } from '@/entities/wallet-type';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Input,
  ROUTER_MAP,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/shared';

import { WalletsFiltersSheet } from '../../../features/wallets/ui/wallet-filters/wallets-filters-sheet';
import { WalletsAggregationSwiper } from '../../../features/wallets/ui/wallets-aggregation-swiper/wallets-aggregation-swiper';

const baseFilters: GetWalletsFilter = {
  search: '',
  balanceStatus: undefined,
  walletKind: undefined,
  walletTypeId: undefined,
  minAmount: null,
  maxAmount: null,
  currencyId: undefined,
  userId: undefined,
  active: undefined,
  pinned: false,
  visible: true,
  deleted: false,
  sortField: WalletSortField.CREATED_AT,
  sortOrder: SortOrder.DESC,
  page: 1,
  limit: 10,
};

export default function WalletsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: walletTypesData } = useWalletTypes();
  const walletTypes = walletTypesData?.walletTypes ?? [];
  const tabTypes = walletTypes
    .filter((type) => type.showInTabs)
    .sort((a, b) => a.tabOrder - b.tabOrder);

  const form = useForm<GetWalletsFilter>({
    resolver: zodResolver(GetWalletsFilterSchema),
    defaultValues: baseFilters,
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const params: Partial<GetWalletsFilter> = {};

    searchParams.forEach((value, key) => {
      if (key === 'minAmount' || key === 'maxAmount') {
        params[key] = value ? Number(value) : null;
      } else if (key === 'page' || key === 'limit') {
        params[key] = Number(value);
      } else if (
        key === 'active' ||
        key === 'pinned' ||
        key === 'visible' ||
        key === 'deleted'
      ) {
        params[key] = value === 'true';
      } else if (value) {
        const k = key as keyof GetWalletsFilter;
        (params as Record<keyof GetWalletsFilter, unknown>)[k] = value;
      }
    });

    if (Object.keys(params).length > 0) {
      form.reset({ ...baseFilters, ...params });
    }

    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    let timeoutId: NodeJS.Timeout;

    const subscription = form.watch((values) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const params = new URLSearchParams();

        Object.entries(values).forEach(([key, value]) => {
          const baseValue = baseFilters[key as keyof GetWalletsFilter];

          if (value === undefined || value === null || value === '') {
            return;
          }

          if (value === baseValue) {
            return;
          }

          params.set(key, String(value));
        });

        const newUrl = params.toString()
          ? `?${params.toString()}`
          : window.location.pathname;
        router.replace(newUrl, { scroll: false });
      }, 300);
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [form, router, isInitialized]);

  const formValues = useWatch({ control: form.control });

  const filteredValues = useMemo(() => {
    if (!formValues) return baseFilters;

    const filtered: Partial<GetWalletsFilter> = {};

    Object.entries(formValues).forEach(([key, value]) => {
      const baseValue = baseFilters[key as keyof GetWalletsFilter];

      if (value === undefined || value === null || value === '') {
        return;
      }

      if (value === baseValue) {
        return;
      }

      const k = key as keyof GetWalletsFilter;
      (filtered as Record<keyof GetWalletsFilter, unknown>)[k] = value;
    });

    const result = {
      ...filtered,
      pinned: formValues.pinned ?? baseFilters.pinned,
      visible: formValues.visible ?? baseFilters.visible,
      deleted: formValues.deleted ?? baseFilters.deleted,
      sortField: formValues.sortField || baseFilters.sortField,
      sortOrder: formValues.sortOrder || baseFilters.sortOrder,
      page: formValues.page || baseFilters.page,
      limit: formValues.limit || baseFilters.limit,
    } as GetWalletsFilter;

    return result;
  }, [formValues]);

  const { data, isLoading, isFetching } = useWallets(filteredValues);
  const showSkeleton = isLoading || isFetching;

  const renderWalletCard = (wallet: Wallet) => {
    switch (wallet.walletKind) {
      case 'crypto':
        return <CryptoWalletCard key={wallet.id} wallet={wallet} />;
      case 'bank':
        return <BankWalletCard key={wallet.id} wallet={wallet} />;
      case 'simple':
      default:
        return <SimpleWalletCard key={wallet.id} wallet={wallet} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-2xl">Список кошельков</CardTitle>
          <div className="flex gap-2 items-center flex-wrap">
            <Input
              placeholder="Поиск"
              value={formValues?.search ?? ''}
              onChange={(e) =>
                form.setValue('search', e.target.value || undefined)
              }
              className="w-full md:w-64"
            />
            <WalletsFiltersSheet form={form} baseFilters={baseFilters} />
            <Button asChild className="md:w-auto">
              <Link
                href={ROUTER_MAP.WALLETS_CREATE}
                className="inline-flex items-center gap-2"
              >
                <Plus className="size-4" />
                <span>Создать кошелек</span>
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <WalletsAggregationSwiper filters={filteredValues} />

      <Tabs
        value={
          formValues?.deleted
            ? 'deleted'
            : !formValues?.visible
              ? 'hidden'
              : formValues?.pinned
                ? 'pinned'
                : formValues?.walletTypeId
                  ? formValues.walletTypeId
                  : 'all'
        }
        onValueChange={(val) => {
          if (val === 'all') {
            form.reset({
              ...baseFilters,
              walletTypeId: undefined,
              pinned: false,
              visible: true,
              deleted: false,
            });
          } else if (val === 'deleted') {
            form.reset({ ...baseFilters, deleted: true, visible: true, pinned: false });
          } else if (val === 'hidden') {
            form.reset({ ...baseFilters, visible: false, deleted: false, pinned: false });
          } else if (val === 'pinned') {
            form.reset({ ...baseFilters, pinned: true, visible: true, deleted: false });
          } else {
            form.reset({
              ...baseFilters,
              walletTypeId: val,
              pinned: false,
              visible: true,
              deleted: false,
            });
          }
        }}
      >
        <TabsList
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${4 + tabTypes.length}, minmax(0, 1fr))`,
          }}
        >
          <TabsTrigger value="pinned" className="w-full">
            Быстрый доступ
          </TabsTrigger>
          <TabsTrigger value="all" className="w-full">
            Все
          </TabsTrigger>
          {tabTypes.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="w-full">
              {type.name}
            </TabsTrigger>
          ))}
          <TabsTrigger value="deleted" className="w-full">
            Удалённые
          </TabsTrigger>
          <TabsTrigger value="hidden" className="w-full">
            Скрытые
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {showSkeleton && (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <WalletCardSkeleton key={index} />
            ))}
          </>
        )}
        {!showSkeleton && data?.wallets.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <WalletIcon />
              </EmptyMedia>
              <EmptyContent>
                <EmptyTitle>Нет кошельков</EmptyTitle>
                <EmptyDescription>
                  Кошельки не найдены. Создайте новый кошелек или измените
                  фильтры.
                </EmptyDescription>
              </EmptyContent>
            </EmptyHeader>
          </Empty>
        )}
        {!showSkeleton && data?.wallets.map(renderWalletCard)}
      </div>
    </div>
  );
}
