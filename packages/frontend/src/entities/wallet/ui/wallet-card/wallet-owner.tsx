'use client';

import type { Wallet } from '@/entities/wallet';
import { Badge } from '@/shared/ui/shadcn/badge';

interface WalletOwnerProps {
  user: Wallet['user'];
}

export function WalletOwner({ user }: WalletOwnerProps) {
  const username = user?.username?.trim() || 'Неизвестный';

  return (
    <Badge variant="outline" className="gap-1">
      <span className="text-xs uppercase text-muted-foreground">владелец</span>
      <span className="font-medium text-foreground">{username}</span>
    </Badge>
  );
}
