"use client";

import React, { useState } from "react";

import type { PinnedWallet } from "@/entities/wallet";
import { WalletOwner } from "@/entities/wallet/ui/wallet-card/wallet-owner";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/shadcn/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/shadcn/dropdown-menu";

interface BankWalletCardProps {
  wallet: PinnedWallet;
}

export const BankWalletCard = ({ wallet }: BankWalletCardProps) => {
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
          <CardHeader className="gap-0 py-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2 sm:max-w-[70%]">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg sm:text-xl">{wallet.name}</CardTitle>
                  <WalletOwner user={wallet.user} />
                </div>
                {wallet.description && <CardDescription>{wallet.description}</CardDescription>}
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Банковский</Badge>
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

          <CardContent className="space-y-3 py-0">
            {/* Банковские детали */}
            {wallet.details && (
              <div className="space-y-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    {wallet.details.ownerFullName && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Владелец карты</p>
                        <p className="font-medium flex items-center">
                          <span>{wallet.details.ownerFullName}</span>
                        </p>
                      </div>
                    )}
                    {wallet.details.card && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Номер карты</p>
                        <p className="font-medium">{wallet.details.card}</p>
                      </div>
                    )}
                  </div>
                  {wallet.details.phone && (
                    <div className="space-y-1 text-left sm:text-right">
                      <p className="text-sm text-muted-foreground">Телефон</p>
                      <p className="font-medium">{wallet.details.phone}</p>
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
