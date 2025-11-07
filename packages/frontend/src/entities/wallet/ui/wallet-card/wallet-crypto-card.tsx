'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { WalletOwner } from '@/entities/wallet';
import type { Wallet } from '@/entities/wallet';
import { WalletService } from '@/entities/wallet/api/wallet-service';
import { WalletMonthlyLimit } from '@/entities/wallet/ui/wallet-monthly-limit/wallet-monthly-limit';
import { ChangeOwnerDialog } from '@/features/wallets/ui/change-owner-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ROUTER_MAP } from '@/shared/utils/constants/router-map';
import { cn, formatDate } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/shadcn/button';
import { formatNumber } from '@/shared/lib/utils/format-number';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/shadcn/dropdown-menu';

interface CryptoWalletCardProps {
  wallet: Wallet;
}

export const CryptoWalletCard = ({ wallet }: CryptoWalletCardProps) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [changeOwnerDialogOpen, setChangeOwnerDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const togglePinMutation = useMutation({
    mutationFn: ({
      pinned,
      pinOnMain,
    }: {
      pinned: boolean;
      pinOnMain: boolean;
    }) => WalletService.toggleWalletPin(wallet.id, pinned, pinOnMain),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', wallet.id] });
      queryClient.invalidateQueries({ queryKey: ['pinnedWallets'] });
      toast.success('Настройки обновлены');
    },
    onError: () => {
      toast.error('Ошибка при обновлении');
    },
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setMenuOpen(true);
    }
  };

  const handleEdit = () => {
    router.push(`${ROUTER_MAP.WALLETS_EDIT}/${wallet.id}`);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    console.info('Delete wallet', wallet.id);
    setMenuOpen(false);
  };

  const handleChangeOwner = () => {
    setMenuOpen(false);
    setChangeOwnerDialogOpen(true);
  };

  const handleTogglePinned = () => {
    togglePinMutation.mutate({
      pinned: !wallet.pinned,
      pinOnMain: wallet.pinOnMain,
    });
    setMenuOpen(false);
  };

  const handleTogglePinOnMain = () => {
    togglePinMutation.mutate({
      pinned: wallet.pinned,
      pinOnMain: !wallet.pinOnMain,
    });
    setMenuOpen(false);
  };

  const balanceStatusMutation = useMutation({
    mutationFn: (status: string) =>
      WalletService.updateBalanceStatus(wallet.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', wallet.id] });
      queryClient.invalidateQueries({ queryKey: ['pinnedWallets'] });
      toast.success('Статус баланса обновлен');
    },
    onError: () => {
      toast.error('Ошибка при обновлении статуса');
    },
  });

  const handleBalanceStatusChange = (status: string) => {
    balanceStatusMutation.mutate(status);
  };

  const toggleActiveMutation = useMutation({
    mutationFn: (active: boolean) =>
      WalletService.toggleActive(wallet.id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['wallet', wallet.id] });
      queryClient.invalidateQueries({ queryKey: ['pinnedWallets'] });
      toast.success(
        wallet.active ? 'Кошелек деактивирован' : 'Кошелек активирован',
      );
    },
    onError: () => {
      toast.error('Ошибка при изменении статуса');
    },
  });

  const handleToggleActive = () => {
    toggleActiveMutation.mutate(!wallet.active);
    setMenuOpen(false);
  };

  const getFullDescription = () => {
    const parts = [];

    if (wallet.details) {
      if (wallet.details.address) {
        parts.push(`Адрес: ${wallet.details.address}`);
      }
      if (wallet.details.exchangeUid) {
        parts.push(`UID: ${wallet.details.exchangeUid}`);
      }
      if (wallet.details.network || wallet.details.networkType) {
        const networkParts = [];
        if (wallet.details.network?.name) {
          networkParts.push(wallet.details.network.name);
        }
        if (wallet.details.networkType?.name) {
          networkParts.push(wallet.details.networkType.name);
        }
        if (networkParts.length > 0) {
          parts.push(`Сеть: ${networkParts.join(' / ')}`);
        }
      }
    }

    if (wallet.description) {
      parts.push(wallet.description);
    }

    return parts.join(' • ');
  };

  const getBorderClass = (status: string) => {
    switch (status) {
      case 'positive':
        return 'border-l-[6px] border-l-green-600';
      case 'negative':
        return 'border-l-[6px] border-l-destructive/60';
      case 'neutral':
        return 'border-l-[6px] border-l-gray-700 dark:border-l-gray-600';
      default:
        return '';
    }
  };

  const getWalletTypeLabel = (
    type:
      | string
      | {
          id: string;
          code: string;
          name: string;
          description: string | null;
          showInTabs: boolean;
          tabOrder: number;
        }
      | null
      | undefined,
  ) => {
    if (!type) {
      return '';
    }

    return typeof type === 'string' ? type : type.name;
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Card
            role="button"
            tabIndex={0}
            onClick={(e) => {
              // Не открываем меню если кликнули на кнопку названия
              if ((e.target as HTMLElement).closest('button[data-wallet-link]')) {
                return;
              }
              setMenuOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className={cn(
              'w-full cursor-pointer overflow-hidden',
              wallet.monthlyLimit && wallet.monthlyLimit > 0 ? 'py-0 gap-0' : 'gap-3',
              getBorderClass(wallet.balanceStatus),
              !wallet.active && 'opacity-40',
            )}
          >
            {wallet.monthlyLimit && wallet.monthlyLimit > 0 && (
              <div className="border-b border-border/40 bg-muted/20 px-6 py-1.5">
                <WalletMonthlyLimit
                  walletId={wallet.id}
                  currencyCode={wallet.currency.code}
                  limit={wallet.monthlyLimit}
                />
              </div>
            )}
            <CardHeader className={wallet.monthlyLimit && wallet.monthlyLimit > 0 ? 'pt-6 pb-6' : ''}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2 sm:max-w-[70%]">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="link"
                      className="text-lg sm:text-xl p-0 h-auto font-semibold relative z-10 no-underline hover:no-underline"
                      data-wallet-link
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        router.push(ROUTER_MAP.WALLET_OPERATIONS(wallet.id));
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      {getWalletTypeLabel(wallet.walletType)} {wallet.name}
                    </Button>
                    <WalletOwner user={wallet.user} />
                  </div>
                  {getFullDescription() && (
                    <CardDescription>{getFullDescription()}</CardDescription>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xl font-bold leading-tight sm:text-2xl">
                    {formatNumber(wallet.amount)} {wallet.currency.code}
                  </p>
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
            </CardHeader>
          </Card>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="z-50 w-56">
          <div className="px-2 py-1.5">
            <div className="text-xs text-muted-foreground mb-2">
              Статус баланса:
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => handleBalanceStatusChange('unknown')}
                className={cn(
                  'w-6 h-6 rounded-full border-2 transition-all hover:scale-110',
                  wallet.balanceStatus === 'unknown'
                    ? 'border-muted-foreground bg-background'
                    : 'border-muted-foreground/30 bg-background',
                )}
                title="Без цвета"
              />
              <button
                onClick={() => handleBalanceStatusChange('negative')}
                className={cn(
                  'w-6 h-6 rounded-full border-2 transition-all hover:scale-110',
                  wallet.balanceStatus === 'negative'
                    ? 'border-destructive bg-destructive/60'
                    : 'border-destructive/30 bg-destructive/60',
                )}
                title="Красный"
              />
              <button
                onClick={() => handleBalanceStatusChange('positive')}
                className={cn(
                  'w-6 h-6 rounded-full border-2 transition-all hover:scale-110',
                  wallet.balanceStatus === 'positive'
                    ? 'border-success bg-success'
                    : 'border-success/30 bg-success/60',
                )}
                title="Зеленый"
              />
              <button
                onClick={() => handleBalanceStatusChange('neutral')}
                className={cn(
                  'w-6 h-6 rounded-full border-2 transition-all hover:scale-110',
                  wallet.balanceStatus === 'neutral'
                    ? 'border-gray-700 dark:border-gray-600 bg-gray-700 dark:bg-gray-600'
                    : 'border-gray-700/30 dark:border-gray-600/30 bg-gray-700/60 dark:bg-gray-600/60',
                )}
                title="Темно-серый"
              />
            </div>
          </div>
          <DropdownMenuItem onSelect={handleEdit}>
            Редактировать
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleChangeOwner}>
            Держатель
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleToggleActive}>
            {wallet.active ? 'Деактивировать' : 'Активировать'}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleTogglePinned}>
            {wallet.pinned ? 'Открепить' : 'Закрепить'}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleTogglePinOnMain}>
            {wallet.pinOnMain ? 'Открепить с главной' : 'Закрепить на главной'}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive/60"
            onSelect={handleDelete}
          >
            Удалить
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangeOwnerDialog
        open={changeOwnerDialogOpen}
        onOpenChange={setChangeOwnerDialogOpen}
        walletId={wallet.id}
        walletName={wallet.name}
        currentOwner={wallet.user}
      />
    </>
  );
};
