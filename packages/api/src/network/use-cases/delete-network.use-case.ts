import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/services/prisma.service';
import { DeleteNetworkResponse } from '../types';

@Injectable()
export class DeleteNetworkUseCase {
  constructor(private readonly prisma: PrismaService) {}

  public async execute(
    networkId: string,
    deletedById: string,
  ): Promise<DeleteNetworkResponse> {
    const existingNetwork = await this.prisma.network.findUnique({
      where: { id: networkId },
    });

    if (!existingNetwork || existingNetwork.deleted) {
      throw new NotFoundException('Сеть не найдена');
    }

    await this.prisma.network.update({
      where: { id: networkId },
      data: {
        deleted: true,
        updatedById: deletedById,
      },
    });

    return {
      message: 'Сеть успешно удалена',
    };
  }
}
