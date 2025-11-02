"use client";

import React, { useMemo, useState } from "react";

import { WalletOwner } from "@/entities/wallet";
import type { PinnedWallet } from "@/entities/wallet";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/shadcn/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/shadcn/dropdown-menu";

interface CryptoWalletCardProps {
  wallet: PinnedWallet;
}

export const CryptoWalletCard = ({ wallet }: CryptoWalletCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setMenuOpen(true);
    }
  };

  const handleEdit = () => {
    console.info("Edit wallet", wallet.id);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    console.info("Delete wallet", wallet.id);
    setMenuOpen(false);
  };

  const getBorderClass = (status: string) => {
    switch (status) {
      case "positive":
        return "border-l-[6px] border-l-emerald-300";
      case "negative":
        return "border-l-[6px] border-l-red-300";
      case "neutral":
        return "border-l-[6px] border-l-slate-400";
      default:
        return "border-l-[6px] border-l-transparent";
    }
  };

  const getWalletTypeLabel = (type: string) => {
    switch (type) {
      case "inskech":
        return "Inskech";
      case "bet11":
        return "Bet11";
      case "vnj":
        return "VNJ";
      default:
        return type;
    }
  };

  const networkLabel = useMemo(() => {
    if (!wallet.details?.network || !wallet.details?.networkType) {
      return null;
    }

    const network = wallet.details.network.code || wallet.details.network.name;
    const networkType = wallet.details.networkType.code || wallet.details.networkType.name;

    return `${network} / ${networkType}`;
  }, [wallet.details?.network, wallet.details?.networkType]);

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Card
          role="button"
          tabIndex={0}
          onClick={() => setMenuOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full gap-3 cursor-pointer",
            getBorderClass(wallet.balanceStatus),
            !wallet.active && "opacity-40"
          )}
        >
          <CardHeader className="py-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2 sm:max-w-[70%]">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg sm:text-xl">{wallet.name}</CardTitle>
                  <WalletOwner user={wallet.user} />
                </div>
                {wallet.description && <CardDescription>{wallet.description}</CardDescription>}
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Криптовалютный</Badge>
                  <Badge variant="outline">{getWalletTypeLabel(wallet.walletType)}</Badge>
                  {wallet.pinOnMain && <Badge variant="outline">На главной</Badge>}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xl font-bold leading-tight sm:text-2xl">
                  {wallet.amount.toLocaleString()} {wallet.currency.code}
                </p>
                <p className="text-sm text-muted-foreground">{wallet.currency.name}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 p-4 py-0">
            {/* Криптовалютные детали */}
            {wallet.details && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[auto_auto_1fr]">
                  {wallet.details.address && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Адрес кошелька</p>
                      <p className="font-mono text-sm break-all">{wallet.details.address}</p>
                    </div>
                  )}
                  {wallet.details.exchangeUid && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">UID биржи</p>
                      <p className="font-mono text-sm">{wallet.details.exchangeUid}</p>
                    </div>
                  )}
                  {networkLabel && (
                    <div className="space-y-1 text-left sm:text-right md:col-start-3">
                      <p className="text-sm text-muted-foreground">Сеть / Тип сети</p>
                      <p className="font-mono text-sm break-all">{networkLabel}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="z-50 w-44">
        <DropdownMenuItem onSelect={handleEdit}>Редактировать</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onSelect={handleDelete}>
          Удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
