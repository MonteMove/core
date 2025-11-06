'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { WalletOwner } from '@/entities/wallet';
import type { Wallet } from '@/entities/wallet';
import { WalletService } from '@/entities/wallet/api/wallet-service';
import { ChangeOwnerDialog } from '@/features/wallets/ui/change-owner-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ROUTER_MAP } from '@/shared/utils/constants/router-map';
import { cn, formatDate } from '@/shared/lib/utils';
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

interface BankWalletCardProps {
  wallet: Wallet;
}

export const BankWalletCard = ({ wallet }: BankWalletCardProps) => {
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
      if (wallet.details.ownerFullName) {
        parts.push(`Владелец: ${wallet.details.ownerFullName}`);
      }
      if (wallet.details.card) {
        parts.push(`Карта: ${wallet.details.card}`);
      }
      if (wallet.details.phone) {
        parts.push(`Телефон: ${wallet.details.phone}`);
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

    const typeCode = typeof type === 'string' ? type : type.code;

    switch (typeCode) {
      case 'inskech':
        return 'Inskech';
      case 'bet11':
        return 'Bet11';
      case 'vnj':
        return 'VNJ';
      default:
        return typeof type === 'string' ? type : type.name;
    }
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Card
            role="button"
            tabIndex={0}
            onClick={() => setMenuOpen(true)}
            onKeyDown={handleKeyDown}
            className={cn(
              'w-full gap-3 cursor-pointer',
              getBorderClass(wallet.balanceStatus),
              !wallet.active && 'opacity-40',
            )}
          >
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2 sm:max-w-[70%]">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-lg sm:text-xl">
                      {getWalletTypeLabel(wallet.walletType)} {wallet.name}
                    </CardTitle>
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
                    ? 'border-green-600 bg-green-600'
                    : 'border-green-600/30 bg-green-600/60',
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
