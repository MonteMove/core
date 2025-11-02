"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  BankWalletCard,
  CryptoWalletCard,
  GetWalletsFilter,
  GetWalletsFilterSchema,
  PinnedWallet,
  SimpleWalletCard,
  SortOrder,
  WalletSortField,
  WalletType,
  useWallets,
} from "@/entities/wallet";
import { Button } from "@/shared/ui/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/shadcn/tabs";
import { ROUTER_MAP } from "@/shared/utils/constants/router-map";

import { WalletsFilters } from "../../../features/wallets/ui/wallet-filters/wallets-filters";

const baseFilters: GetWalletsFilter = {
  search: "",
  balanceStatus: undefined,
  walletKind: undefined,
  walletType: undefined,
  minAmount: null,
  maxAmount: null,
  currencyId: undefined,
  userId: undefined,
  active: false,
  pinned: false,
  visible: true,
  deleted: false,
  sortField: WalletSortField.CREATED_AT,
  sortOrder: SortOrder.DESC,
  page: 1,
  limit: 10,
};

export default function WalletsPage() {
  const form = useForm<GetWalletsFilter>({
    resolver: zodResolver(GetWalletsFilterSchema),
    defaultValues: { ...baseFilters, pinned: true },
  });

  const { data, isLoading } = useWallets(form.watch());

  const renderWalletCard = (wallet: PinnedWallet) => {
    switch (wallet.walletKind) {
      case "crypto":
        return <CryptoWalletCard key={wallet.id} wallet={wallet} />;
      case "bank":
        return <BankWalletCard key={wallet.id} wallet={wallet} />;
      case "simple":
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
            <Link href={ROUTER_MAP.WALLETS_CREATE} className="inline-flex items-center gap-2">
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
          form.watch("deleted")
            ? "deleted"
            : !form.watch("visible")
              ? "hidden"
              : form.watch("pinned")
                ? "pinned"
                : form.watch("walletType") || "all"
        }
        onValueChange={(val) => {
          if (val === "all") {
            form.reset({ ...baseFilters });
          } else if (val === "deleted") {
            form.reset({ ...baseFilters, deleted: true });
          } else if (val === "hidden") {
            form.reset({ ...baseFilters, visible: false });
          } else if (val === "pinned") {
            form.reset({ ...baseFilters, pinned: true });
          } else {
            form.reset({ ...baseFilters, walletType: val as WalletType });
          }
        }}
      >
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="pinned" className="w-full">
            Быстрый доступ
          </TabsTrigger>
          <TabsTrigger value="all" className="w-full">
            Все
          </TabsTrigger>
          <TabsTrigger value={WalletType.inskech} className="w-full">
            Инскеш
          </TabsTrigger>
          <TabsTrigger value={WalletType.bet11} className="w-full">
            Bet11
          </TabsTrigger>
          <TabsTrigger value={WalletType.vnj} className="w-full">
            ВНЖ
          </TabsTrigger>
          <TabsTrigger value="deleted" className="w-full">
            Удалённые
          </TabsTrigger>
          <TabsTrigger value="hidden" className="w-full">
            Скрытые
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {isLoading && <div>Загрузка...</div>}
        {!isLoading && data?.wallets.map(renderWalletCard)}
      </div>
    </div>
  );
}
