import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { CreateApplicationDto } from '../dto';
import { CreateApplicationOutput } from '../types';

@Injectable()
export class CreateApplicationUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(createApplicationDto: CreateApplicationDto, userId: string): Promise<CreateApplicationOutput> {
        const {
            description,
            amount,
            currencyId,
            operationTypeId,
            assigneeUserId,
            telegramUsername,
            phone,
            meetingDate,
        } = createApplicationDto;

        const application = await this.prisma.application.create({
            data: {
                userId,
                updatedById: userId,
                description,
                amount,
                currencyId,
                operationTypeId,
                assigneeUserId,
                telegramUsername,
                phone,
                meetingDate: new Date(meetingDate),
                status: 'open',
            },
            include: {
                created_by: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                updated_by: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                assignee_user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                currency: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
                operation_type: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                operation: {
                    select: {
                        id: true,
                        description: true,
                    },
                },
            },
        });

        const { deleted: _, ...applicationResponse } = application;

        return {
            message: 'Заявка успешно создана',
            application: applicationResponse,
        };
    }
}
