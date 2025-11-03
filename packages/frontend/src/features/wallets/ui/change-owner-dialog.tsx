'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { UserService } from '@/entities/users/api/users-service';
import type { UserType } from '@/entities/users/model/user-schemas';
import { WalletService } from '@/entities/wallet/api/wallet-service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/shadcn/dialog';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select';
import { Loader2 } from 'lucide-react';

interface ChangeOwnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletId: string;
  walletName: string;
  currentOwner?: {
    id: string;
    username: string;
  } | null;
  onConfirm?: (newOwnerId: string) => void;
}

export const ChangeOwnerDialog = ({
  open,
  onOpenChange,
  walletId,
  walletName,
  currentOwner,
  onConfirm,
}: ChangeOwnerDialogProps) => {
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>(
    currentOwner?.id || '',
  );
  const queryClient = useQueryClient();

  const { data: holdersData, isLoading } = useQuery({
    queryKey: ['users', 'holders'],
    queryFn: () =>
      UserService.getUsers({
        isHolder: true,
        limit: 100,
      }),
    enabled: open,
  });

  const changeOwnerMutation = useMutation({
    mutationFn: (newOwnerId: string) =>
      WalletService.changeWalletOwner(walletId, newOwnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['pinnedWallets'] });
      toast.success('Держатель кошелька успешно изменен');
      onConfirm?.(selectedOwnerId);
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Ошибка при смене держателя',
      );
    },
  });

  const holders = holdersData?.users || [];

  const handleConfirm = () => {
    if (selectedOwnerId && selectedOwnerId !== currentOwner?.id) {
      changeOwnerMutation.mutate(selectedOwnerId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Изменить держателя кошелька</DialogTitle>
          <DialogDescription>
            Выберите нового держателя для кошелька &quot;{walletName}&quot;
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <Select value={selectedOwnerId} onValueChange={setSelectedOwnerId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите держателя" />
              </SelectTrigger>
              <SelectContent>
                {holders.map((holder: UserType) => (
                  <SelectItem key={holder.id} value={holder.id}>
                    {holder.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {!isLoading && holders.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Нет доступных держателей. Назначьте пользователям статус держателя
              в разделе управления пользователями.
            </p>
          )}
          {currentOwner && (
            <p className="text-sm text-muted-foreground mt-4">
              Текущий держатель:{' '}
              <span className="font-medium">{currentOwner.username}</span>
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={changeOwnerMutation.isPending}
          >
            Отмена
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              !selectedOwnerId ||
              selectedOwnerId === currentOwner?.id ||
              changeOwnerMutation.isPending
            }
          >
            {changeOwnerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Изменение...
              </>
            ) : (
              'Изменить'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
