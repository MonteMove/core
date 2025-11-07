import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class RestorePlatformUseCase {
    constructor(private readonly prisma: PrismaService) {}

    public async execute(platformId: string, restoredById: string): Promise<{ message: string }> {
        const platform = await this.prisma.platform.findUnique({
            where: { id: platformId },
        });

        if (!platform) {
            throw new NotFoundException('Платформа не найдена');
        }

        if (!platform.deleted) {
            throw new NotFoundException('Платформа не удалена');
        }

        await this.prisma.platform.update({
            where: { id: platformId },
            data: {
                deleted: false,
                updatedById: restoredById,
            },
        });

        return {
            message: 'Платформа успешно восстановлена',
        };
    }
}
