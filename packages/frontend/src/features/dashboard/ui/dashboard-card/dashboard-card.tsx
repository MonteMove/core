"use client";

import React from "react";

import type { PinnedWallet, WalletCurrencyGroup } from "@/entities/wallet";
import { BankWalletCard } from "@/entities/wallet";
import { CryptoWalletCard } from "@/entities/wallet";
import { SimpleWalletCard } from "@/entities/wallet";
import { Card, CardContent } from "@/shared";
import { Skeleton } from "@/shared";

interface CardDashboardProps {
  isLoading: boolean;
  hasError: boolean;
  currencyGroups: WalletCurrencyGroup[];
}

export const CardDashboard = ({ isLoading, hasError, currencyGroups }: CardDashboardProps) => {
  const getWalletsLabel = (count: number) => {
    const mod100 = count % 100;
    const mod10 = count % 10;

    if (mod100 >= 11 && mod100 <= 14) return "кошельков";
    if (mod10 === 1) return "кошелек";
    if (mod10 >= 2 && mod10 <= 4) return "кошелька";
    return "кошельков";
  };

  const renderWalletCard = (wallet: PinnedWallet) => {
    switch (wallet.walletKind) {
      case "crypto":
        return <CryptoWalletCard key={wallet.id} wallet={wallet} />;
      case "bank":
        return <BankWalletCard key={wallet.id} wallet={wallet} />;
      case "simple":
        return <SimpleWalletCard key={wallet.id} wallet={wallet} />;
      default:
        return <SimpleWalletCard key={wallet.id} wallet={wallet} />;
    }
  };

  if (hasError) {
    return (
      <Card className="w-full">
        <CardContent className="p-4 text-sm text-destructive">
          Не удалось загрузить список кошельков
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="w-full">
            <CardContent className="space-y-3 p-4">
              <Skeleton className="h-4 w-20" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const groupsWithWallets = currencyGroups.filter((group) => group.wallets.length > 0);

  if (groupsWithWallets.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-4 text-sm text-muted-foreground">
          Нет кошельков для отображения
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {groupsWithWallets.map((group) => {
        const firstWallet = group.wallets[0];
        const currencyCode = firstWallet?.currency.code ?? group.currency.toUpperCase();
        const currencyName = firstWallet?.currency.name ?? currencyCode;
        const totalAmount = group.wallets.reduce((sum, wallet) => sum + wallet.amount, 0);

        return (
          <section key={group.currency} className="space-y-2">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">{currencyName}</p>
                <h2 className="text-base font-semibold uppercase tracking-wide sm:text-lg">
                  {currencyCode}
                </h2>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>
                  {group.wallets.length} {getWalletsLabel(group.wallets.length)}
                </p>
                <p className="font-medium text-foreground">
                  {totalAmount.toLocaleString()} {currencyCode}
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              {group.wallets.map((wallet) => renderWalletCard(wallet))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
