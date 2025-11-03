'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

import {
  BankWalletCard,
  CryptoWalletCard,
  GetWalletsFilter,
  GetWalletsFilterSchema,
  PinnedWallet,
  SimpleWalletCard,
  SortOrder,
  WalletSortField,
  useWallets,
} from '@/entities/wallet';
import { useWalletTypes } from '@/entities/wallet-type';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/shadcn/tabs';
import { ROUTER_MAP } from '@/shared/utils/constants/router-map';

import { WalletsFilters } from '../../../features/wallets/ui/wallet-filters/wallets-filters';

const baseFilters: GetWalletsFilter = {
  search: '',
  balanceStatus: undefined,
  walletKind: undefined,
  walletTypeId: undefined,
  walletTypeIdIsNull: undefined,
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
  const tabTypes = walletTypes.filter((type) => type.showInTabs);

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
        params[key as keyof GetWalletsFilter] = value as any;
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

      filtered[key as keyof GetWalletsFilter] = value as any;
    });

    return {
      ...filtered,
      sortField: formValues.sortField || baseFilters.sortField,
      sortOrder: formValues.sortOrder || baseFilters.sortOrder,
      page: formValues.page || baseFilters.page,
      limit: formValues.limit || baseFilters.limit,
    } as GetWalletsFilter;
  }, [formValues]);

  const { data, isLoading } = useWallets(filteredValues);

  const renderWalletCard = (wallet: PinnedWallet) => {
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
          <Button asChild className="md:w-auto">
            <Link
              href={ROUTER_MAP.WALLETS_CREATE}
              className="inline-flex items-center gap-2"
            >
              <Plus className="size-4" />
              <span>Создать кошелек</span>
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <WalletsFilters form={form} />
        </CardContent>
      </Card>

      {/* Табы */}
      <Tabs
        value={
          formValues?.deleted
            ? 'deleted'
            : !formValues?.visible
              ? 'hidden'
              : formValues?.pinned
                ? 'pinned'
                : formValues?.walletTypeId || 'all'
        }
        onValueChange={(val) => {
          if (val === 'all') {
            form.reset({
              ...baseFilters,
              walletTypeIdIsNull: true,
              pinned: false,
            });
          } else if (val === 'deleted') {
            form.reset({ ...baseFilters, deleted: true });
          } else if (val === 'hidden') {
            form.reset({ ...baseFilters, visible: false });
          } else if (val === 'pinned') {
            form.reset({ ...baseFilters, pinned: true });
          } else {
            form.reset({ ...baseFilters, walletTypeId: val });
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
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Загрузка...</p>
          </div>
        )}
        {!isLoading && data?.wallets.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Нет кошельков</p>
          </div>
        )}
        {!isLoading && data?.wallets.map(renderWalletCard)}
      </div>
    </div>
  );
}
