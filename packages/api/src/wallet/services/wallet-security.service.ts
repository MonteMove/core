import { Injectable } from '@nestjs/common';

export interface WalletDetailChanges {
  field: string;
  oldValue: string | null;
  newValue: string | null;
}

@Injectable()
export class WalletSecurityService {
  private readonly criticalFields = [
    'phone',
    'card',
    'ownerFullName',
    'networkId',
    'networkTypeId',
    'address',
    'accountId',
    'username',
    'exchangeUid',
  ];

  public detectCriticalChanges(
    oldData: Record<string, string | null | undefined>,
    newData: Record<string, string | null | undefined>,
  ): WalletDetailChanges[] {
    const changes: WalletDetailChanges[] = [];

    for (const field of this.criticalFields) {
      const oldValue = oldData[field];
      const newValue = newData[field];

      if (this.isValueChanged(oldValue, newValue)) {
        changes.push({
          field,
          oldValue: oldValue || null,
          newValue: newValue || null,
        });
      }
    }

    return changes;
  }

  private isValueChanged(
    oldValue: string | null | undefined,
    newValue: string | null | undefined,
  ): boolean {
    const normalizeValue = (
      value: string | null | undefined,
    ): string | null => {
      if (value === null || value === undefined || value === '') {
        return null;
      }

      return String(value);
    };

    const normalizedOld = normalizeValue(oldValue);
    const normalizedNew = normalizeValue(newValue);

    return normalizedOld !== normalizedNew;
  }

  public hasCriticalChanges(changes: WalletDetailChanges[]): boolean {
    return changes.length > 0;
  }

  public filterCriticalChanges(
    allChanges: Record<string, string | null | undefined>,
  ): Record<string, string | null | undefined> {
    const criticalChanges: Record<string, string | null | undefined> = {};

    for (const field of this.criticalFields) {
      if (field in allChanges) {
        criticalChanges[field] = allChanges[field];
      }
    }

    return criticalChanges;
  }
}
