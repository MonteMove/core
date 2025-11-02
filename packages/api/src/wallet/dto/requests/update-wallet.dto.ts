import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

import { BalanceStatus, WalletKind, WalletType } from '../../../../prisma/generated/prisma';

export class UpdateWalletDto {
    @ApiProperty({
        description: 'Название кошелька',
        example: 'Основной кошелек',
        maxLength: 255,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Название должно быть строкой' })
    @MaxLength(255, { message: 'Название не должно превышать 255 символов' })
    public name?: string;

    @ApiProperty({
        description: 'Описание кошелька',
        example: 'Основной кошелек для хранения средств',
        maxLength: 2000,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Описание должно быть строкой' })
    @MaxLength(2000, { message: 'Описание не должно превышать 2000 символов' })
    public description?: string;

    @ApiProperty({
        description: 'Сумма в кошельке',
        example: 10000,
        required: false,
    })
    @IsOptional()
    @IsInt({ message: 'Сумма должна быть целым числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    public amount?: number;

    @ApiProperty({
        description: 'Статус баланса',
        enum: BalanceStatus,
        example: BalanceStatus.positive,
        required: false,
    })
    @IsOptional()
    @IsEnum(BalanceStatus, { message: 'Неверный статус баланса' })
    public balanceStatus?: BalanceStatus;

    @ApiProperty({
        description: 'Тип кошелька',
        enum: WalletKind,
        example: WalletKind.simple,
        required: false,
    })
    @IsOptional()
    @IsEnum(WalletKind, { message: 'Неверный тип кошелька' })
    public walletKind?: WalletKind;

    @ApiProperty({
        description: 'Тип кошелька (inskech, bet11, vnj)',
        enum: WalletType,
        example: WalletType.inskech,
        required: false,
    })
    @IsOptional()
    @IsEnum(WalletType, { message: 'Неверный тип кошелька' })
    public walletType?: WalletType;

    @ApiProperty({
        description: 'ID валюты',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'ID валюты должен быть валидным UUID' })
    public currencyId?: string;

    @ApiProperty({
        description: 'Активен ли кошелек',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Активность должна быть булевым значением' })
    public active?: boolean;

    @ApiProperty({
        description: 'Закрепить на главной странице',
        example: false,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Закрепление должно быть булевым значением' })
    public pinOnMain?: boolean;

    @ApiProperty({
        description: 'Закреплен ли кошелек',
        example: false,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Закрепление должно быть булевым значением' })
    public pinned?: boolean;

    @ApiProperty({
        description: 'Видим ли кошелек',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Видимость должна быть булевым значением' })
    public visible?: boolean;

    @ApiProperty({
        description: 'Удален ли кошелек',
        example: false,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Удаление должно быть булевым значением' })
    public deleted?: boolean;
}
