import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { WalletResponseDto } from './wallet-response.dto';

export class PinnedWalletCurrencyGroupDto {
    @ApiProperty({ description: 'Код валюты', example: 'rub' })
    public currency: string;

    @ApiProperty({
        description: 'Кошельки в данной валюте',
        type: 'array',
        items: { $ref: getSchemaPath(WalletResponseDto) },
    })
    public wallets: WalletResponseDto[];
}

@ApiExtraModels(WalletResponseDto)
export class GetPinnedWalletsResponseDto {
    @ApiProperty({
        description: 'Кошельки, сгруппированные по валютам',
        type: [PinnedWalletCurrencyGroupDto],
        example: [
            {
                currency: 'usdt',
                wallets: [
                    {
                        id: '123',
                        user: { id: 'u1', username: 'user1' },
                        amount: 100,
                        currencyId: 'cur1',
                        updatedById: 'u2',
                    },
                ],
            },
            {
                currency: 'rub',
                wallets: [
                    {
                        id: '456',
                        user: { id: 'u3', username: 'user3' },
                        amount: 200,
                        currencyId: 'cur2',
                        updatedById: 'u4',
                    },
                ],
            },
        ],
    })
    public currencyGroups: PinnedWalletCurrencyGroupDto[];

    @ApiProperty({ description: 'Общее количество закрепленных кошельков', example: 5 })
    public totalWallets: number;

    @ApiProperty({ description: 'Количество валют с закрепленными кошельками', example: 2 })
    public totalCurrencies: number;
}
