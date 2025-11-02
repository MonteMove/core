import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { Workbook } from 'exceljs';

import { PrismaService } from '../../common/services/prisma.service';
import { GetClosingPeriodReportDto } from '../dto';
import { ClosingPeriodRow, ReportFile } from '../types';

@Injectable()
export class GenerateClosingPeriodReportUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(dto: GetClosingPeriodReportDto): Promise<ReportFile> {
        const wallets: { name: string; amount: number; currency: { code: string } }[] =
            await this.prisma.wallet.findMany({
                where: {
                    deleted: false,
                    OR: [{ visible: true }, { visible: false }],
                    ...(dto.walletType ? { walletType: dto.walletType } : {}),
                },
                select: {
                    id: true,
                    name: true,
                    amount: true,
                    currency: {
                        select: {
                            code: true,
                        },
                    },
                },
                orderBy: {
                    name: 'asc',
                },
            });

        const rows: ClosingPeriodRow[] = wallets.map((wallet) => ({
            name: wallet.name,
            balance: wallet.amount,
            currency: wallet.currency.code,
        }));

        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('closing-period');

        worksheet.columns = [
            { header: 'Наименование', key: 'name', width: 32 },
            { header: 'Баланс', key: 'balance', width: 18 },
            { header: 'Валюта', key: 'currency', width: 12 },
        ];

        rows.forEach((row) => worksheet.addRow(row));

        const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
        const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');

        return {
            buffer,
            filename: `closing-period-report-${timestamp}.xlsx`,
        };
    }
}
