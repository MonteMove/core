import { ApiProperty } from '@nestjs/swagger';

export class WalletTypeResponseDto {
    @ApiProperty({ description: 'ID типа кошелька' })
    public id: string;

    @ApiProperty({ description: 'Код типа', example: 'inskech' })
    public code: string;

    @ApiProperty({ description: 'Название типа', example: 'Инскеш' })
    public name: string;

    @ApiProperty({ description: 'Описание', required: false })
    public description: string | null;

    @ApiProperty({ description: 'Показывать в табах', example: true })
    public showInTabs: boolean;

    @ApiProperty({ description: 'Порядок в табах', example: 1 })
    public tabOrder: number;

    @ApiProperty({ description: 'Активен', example: true })
    public active: boolean;

    @ApiProperty({ description: 'Удалён', example: false })
    public deleted: boolean;

    @ApiProperty({ description: 'Дата создания' })
    public createdAt: Date;

    @ApiProperty({ description: 'Дата обновления' })
    public updatedAt: Date;
}

export class GetWalletTypesResponseDto {
    @ApiProperty({ type: [WalletTypeResponseDto] })
    public walletTypes: WalletTypeResponseDto[];
}

export class CreateWalletTypeResponseDto {
    @ApiProperty()
    public message: string;

    @ApiProperty({ type: WalletTypeResponseDto })
    public walletType: WalletTypeResponseDto;
}

export class UpdateWalletTypeResponseDto {
    @ApiProperty()
    public message: string;

    @ApiProperty({ type: WalletTypeResponseDto })
    public walletType: WalletTypeResponseDto;
}

export class DeleteWalletTypeResponseDto {
    @ApiProperty()
    public message: string;
}
