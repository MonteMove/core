import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';

export interface MonthlyAnalyticsItem {
    month: string;
    coming: number;
    expenditure: number;
    netFlow: number;
    operationsCount: number;
}

export interface GetWalletMonthlyAnalyticsOutput {
    message: string;
    analytics: MonthlyAnalyticsItem[];
}

@Injectable()
export class GetWalletMonthlyAnalyticsUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(): Promise<GetWalletMonthlyAnalyticsOutput> {
        const monthsAgo = 6;
        const startDate = new Date();

        startDate.setMonth(startDate.getMonth() - monthsAgo);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);

        const operations = await this.prisma.operation.findMany({
            where: {
                deleted: false,
                createdAt: {
                    gte: startDate,
                },
            },
            include: {
                entries: true,
            },
        });

        const monthlyData = new Map<string, MonthlyAnalyticsItem>();

        for (let i = monthsAgo - 1; i >= 0; i--) {
            const date = new Date();

            date.setMonth(date.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

            monthlyData.set(monthKey, {
                month: monthName,
                coming: 0,
                expenditure: 0,
                netFlow: 0,
                operationsCount: 0,
            });
        }

        operations.forEach((operation) => {
            const date = new Date(operation.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthlyData.has(monthKey)) {
                return;
            }

            const monthData = monthlyData.get(monthKey)!;

            monthData.operationsCount++;

            operation.entries.forEach((entry) => {
                if (entry.direction === 'credit') {
                    monthData.coming += entry.amount;
                } else {
                    monthData.expenditure += entry.amount;
                }
            });
        });

        monthlyData.forEach((data) => {
            data.netFlow = data.coming - data.expenditure;
        });

        const analytics = Array.from(monthlyData.values());

        return {
            message: 'Месячная аналитика успешно получена',
            analytics,
        };
    }
}
