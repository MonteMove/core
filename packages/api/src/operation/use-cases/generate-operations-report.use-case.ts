import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { Workbook } from 'exceljs';

import { OperationDirection, Prisma } from '../../../prisma/generated/prisma';
import { PrismaService } from '../../common';
import { GetOperationsReportDto, OperationReportWalletFilter } from '../dto';
import {
  GeneralReportRow,
  OperationsReportOperation,
  ReportFile,
  WalletLookupEntry,
} from '../types';

@Injectable()
export class GenerateOperationsReportUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(dto: GetOperationsReportDto): Promise<ReportFile> {
    const operations = await this.prisma.operation.findMany({
      where: this.buildWhere(dto),
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        entries: {
          where: { deleted: false },
          select: {
            id: true,
            walletId: true,
            direction: true,
            amount: true,
          },
        },
        type: {
          select: {
            id: true,
            name: true,
          },
        },
        created_by: {
          select: {
            id: true,
            username: true,
          },
        },
        application: {
          where: { deleted: false },
          select: {
            id: true,
          },
        },
      },
    });

    const walletMap = await this.buildWalletMap(operations);

    const rows = this.buildRows(
      operations,
      walletMap,
      dto.typeUnloading ?? OperationReportWalletFilter.all,
    );

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('operations');

    worksheet.columns = [
      { header: 'Номер', key: 'number', width: 10 },
      { header: 'Дата', key: 'date', width: 22 },
      { header: 'Тип операции', key: 'operationType', width: 24 },
      { header: 'Автор', key: 'author', width: 18 },
      { header: 'Комментарий', key: 'comment', width: 32 },
      { header: 'Источник', key: 'source', width: 28 },
      { header: 'Сумма', key: 'amount', width: 14 },
      { header: 'Валюта', key: 'currency', width: 12 },
      { header: 'Номер заявки', key: 'applicationNumber', width: 16 },
    ];

    rows.forEach((row) => worksheet.addRow(row));

    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');

    return {
      buffer,
      filename: `operations-report-${timestamp}.xlsx`,
    };
  }

  private buildWhere(dto: GetOperationsReportDto): Prisma.OperationWhereInput {
    return {
      deleted: false,
      ...(dto.operationTypeId ? { typeId: dto.operationTypeId } : {}),
      ...(dto.dateStart || dto.dateEnd
        ? {
            createdAt: {
              ...(dto.dateStart ? { gte: dto.dateStart } : {}),
              ...(dto.dateEnd ? { lte: dto.dateEnd } : {}),
            },
          }
        : {}),
    } satisfies Prisma.OperationWhereInput;
  }

  private async buildWalletMap(
    operations: OperationsReportOperation[],
  ): Promise<Map<string, WalletLookupEntry>> {
    const walletIds = new Set<string>();

    operations.forEach((operation) => {
      operation.entries.forEach((entry) => walletIds.add(entry.walletId));
    });

    if (walletIds.size === 0) {
      return new Map();
    }

    const wallets: {
      id: string;
      name: string;
      walletType: { code: string } | null;
      currency: { code: string };
    }[] = await this.prisma.wallet.findMany({
      where: {
        id: {
          in: Array.from(walletIds),
        },
      },
      select: {
        id: true,
        name: true,
        walletType: {
          select: {
            code: true,
          },
        },
        currency: {
          select: {
            code: true,
          },
        },
      },
    });

    const walletMap = new Map<string, WalletLookupEntry>();

    wallets.forEach((wallet) => {
      walletMap.set(wallet.id, {
        id: wallet.id,
        name: wallet.name,
        walletType: wallet.walletType,
        currencyCode: wallet.currency.code,
      });
    });

    return walletMap;
  }

  private buildRows(
    operations: OperationsReportOperation[],
    walletMap: Map<string, WalletLookupEntry>,
    filter: OperationReportWalletFilter,
  ): GeneralReportRow[] {
    const rows: GeneralReportRow[] = [];
    let sequence = 0;

    operations.forEach((operation) => {
      if (operation.entries.length === 0) {
        return;
      }

      if (!this.shouldIncludeOperation(operation, walletMap, filter)) {
        return;
      }

      sequence += 1;

      const baseRow = {
        number: sequence,
        date: format(operation.createdAt, 'yyyy-MM-dd HH:mm:ss'),
        operationType: operation.type?.name ?? 'Неизвестно',
        author: operation.created_by?.username ?? 'Неизвестно',
        comment: operation.description ?? '',
        applicationNumber: this.resolveApplicationNumber(operation),
      } satisfies Omit<GeneralReportRow, 'source' | 'amount' | 'currency'>;

      operation.entries.forEach((entry) => {
        const wallet = walletMap.get(entry.walletId);
        const walletName = wallet?.name ?? 'Неизвестный кошелек';
        const currencyCode = wallet?.currencyCode ?? '';
        const sign = entry.direction === OperationDirection.credit ? 1 : -1;
        const amountValue = (sign * entry.amount).toString();

        rows.push({
          ...baseRow,
          source: walletName,
          amount: amountValue,
          currency: currencyCode,
        });
      });
    });

    return rows;
  }

  private shouldIncludeOperation(
    operation: OperationsReportOperation,
    walletMap: Map<string, WalletLookupEntry>,
    filter: OperationReportWalletFilter,
  ): boolean {
    if (filter === OperationReportWalletFilter.all) {
      return true;
    }

    const walletTypeCodes = operation.entries
      .map((entry) => walletMap.get(entry.walletId)?.walletType?.code)
      .filter((code): code is string => Boolean(code));

    if (walletTypeCodes.length === 0) {
      return true;
    }

    if (filter === OperationReportWalletFilter.wnzh) {
      return walletTypeCodes.some((code) => code === 'vnj');
    }

    if (filter === OperationReportWalletFilter.inskesh) {
      return walletTypeCodes.some((code) => code === 'inskech');
    }

    return walletTypeCodes.some((code) => code !== 'vnj' && code !== 'inskech');
  }

  private resolveApplicationNumber(
    operation: OperationsReportOperation,
  ): string {
    if (!operation.application) {
      return 'Простая операция';
    }

    return String(operation.application.id);
  }
}
