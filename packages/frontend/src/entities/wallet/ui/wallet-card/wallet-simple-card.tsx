"use client";

import React, { useState } from "react";

import { WalletOwner } from "@/entities/wallet";
import type { PinnedWallet } from "@/entities/wallet";
import { cn, formatDate } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/shadcn/badge";
import { Card, CardContent, CardDescription, CardTitle } from "@/shared/ui/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/shadcn/dropdown-menu";

interface SimpleWalletCardProps {
  wallet: PinnedWallet;
}

export const SimpleWalletCard = ({ wallet }: SimpleWalletCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Card
          role="button"
          tabIndex={0}
          onClick={() => setMenuOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full cursor-pointer",
            getBorderClass(wallet.balanceStatus),
            !wallet.active && "opacity-40"
          )}
        >
          <CardContent className="py-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2 flex flex-col sm:max-w-[70%]">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg sm:text-xl">{wallet.name}</CardTitle>
                  <WalletOwner user={wallet.user} />
                </div>
                {wallet.description && <CardDescription>{wallet.description}</CardDescription>}
                <div className="flex gap-2 flex-wrap mt-auto">
                  <Badge variant="outline">Простой</Badge>
                  <Badge variant="outline">{getWalletTypeLabel(wallet.walletType)}</Badge>
                  {wallet.pinOnMain && <Badge variant="outline">На главной</Badge>}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xl font-bold leading-tight sm:text-2xl">
                  {wallet.amount.toLocaleString()} {wallet.currency.code}
                </p>
                <p className="text-sm text-muted-foreground">{wallet.currency.name}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Создан: {formatDate(new Date(wallet.createdAt))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Обновлен: {formatDate(new Date(wallet.updatedAt))}
                  </p>
                </div>
              </div>
            </div>
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
