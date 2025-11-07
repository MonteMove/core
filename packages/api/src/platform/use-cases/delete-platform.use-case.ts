import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class DeletePlatformUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(platformId: string, deletedById: string): Promise<{ message: string }> {
        const platform = await this.prisma.platform.findUnique({
            where: { id: platformId },
            include: {
                walletDetails: {
                    where: { wallet: { deleted: false } },
                    select: { id: true },
                },
            },
        });

        if (!platform || platform.deleted) {
            throw new NotFoundException('Платформа не найдена');
        }

        if (platform.walletDetails.length > 0) {
            throw new BadRequestException(
                `Нельзя удалить платформу, которая используется в ${platform.walletDetails.length} кошельках`,
            );
        }

        await this.prisma.platform.update({
            where: { id: platformId },
            data: {
                deleted: true,
                updatedById: deletedById,
            },
        });

        return {
            message: 'Платформа успешно удалена',
        };
    }
}
