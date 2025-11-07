import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
    MinLength,
    ValidateNested,
} from 'class-validator';

import { BalanceStatus, WalletKind } from '../../../../prisma/generated/prisma';

class WalletDetailsDto {
    @ApiProperty({
        description: 'Телефон',
        example: '+79991234567',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Телефон должен быть строкой' })
    @MaxLength(64, { message: 'Телефон не должен превышать 64 символа' })
    public phone?: string;

    @ApiProperty({
        description: 'Номер карты',
        example: '1234 5678 9012 3456',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Номер карты должен быть строкой' })
    @MaxLength(64, { message: 'Номер карты не должен превышать 64 символов' })
    public card?: string;

    @ApiProperty({
        description: 'Полное имя владельца',
        example: 'Иван Иванов',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Полное имя должно быть строкой' })
    @MaxLength(255, { message: 'Полное имя не должно превышать 255 символов' })
    public ownerFullName?: string;

    @ApiProperty({
        description: 'Адрес кошелька',
        example: '0x1234567890abcdef',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Адрес должен быть строкой' })
    @MaxLength(512, { message: 'Адрес не должен превышать 512 символов' })
    public address?: string;

    @ApiProperty({
        description: 'Идентификатор аккаунта',
        example: 'account-123',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Идентификатор аккаунта должен быть строкой' })
    @MaxLength(255, {
        message: 'Идентификатор аккаунта не должен превышать 255 символов',
    })
    public accountId?: string;

    @ApiProperty({
        description: 'Имя пользователя',
        example: 'nickname',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Имя пользователя должно быть строкой' })
    @MaxLength(255, {
        message: 'Имя пользователя не должно превышать 255 символов',
    })
    public username?: string;

    @ApiProperty({
        description: 'UID биржи',
        example: 'uid-123',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'UID биржи должен быть строкой' })
    @MaxLength(255, { message: 'UID биржи не должен превышать 255 символов' })
    public exchangeUid?: string;

    @ApiProperty({
        description: 'ID сети',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'ID сети должен быть валидным UUID' })
    public networkId?: string;

    @ApiProperty({
        description: 'ID типа сети',
        example: '123e4567-e89b-12d3-a456-426614174001',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'ID типа сети должен быть валидным UUID' })
    public networkTypeId?: string;
}

export class CreateWalletDto {
    @ApiProperty({
        description: 'Название кошелька',
        example: 'Основной кошелек',
        maxLength: 255,
        required: true,
    })
    @IsString({ message: 'Название должно быть строкой' })
    @MinLength(2, { message: 'Название должно содержать минимум 2 символа' })
    @MaxLength(255, { message: 'Название не должно превышать 255 символов' })
    public name: string;

    @ApiProperty({
        description: 'Описание кошелька',
        example: 'Основной кошелек для хранения средств',
        maxLength: 2000,
        required: false,
    })
    @IsString({ message: 'Описание должно быть строкой' })
    @IsOptional()
    @MaxLength(2000, { message: 'Описание не должно превышать 2000 символов' })
    public description?: string;

    @ApiProperty({
        description: 'Сумма в кошельке',
        example: 10000,
        required: true,
    })
    @IsInt({ message: 'Сумма должна быть целым числом' })
    @Min(0, { message: 'Сумма не может быть отрицательной' })
    public amount: number;

    @ApiProperty({
        description: 'Статус баланса',
        enum: BalanceStatus,
        example: BalanceStatus.unknown,
        required: false,
    })
    @IsOptional()
    @IsEnum(BalanceStatus, { message: 'Неверный статус баланса' })
    public balanceStatus?: BalanceStatus = BalanceStatus.unknown;

    @ApiProperty({
        description: 'Тип кошелька',
        enum: WalletKind,
        example: WalletKind.simple,
        required: false,
    })
    @IsOptional()
    @IsEnum(WalletKind, { message: 'Неверный тип кошелька' })
    public walletKind?: WalletKind = WalletKind.simple;

    @ApiProperty({
        description: 'ID типа кошелька',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'ID типа кошелька должен быть строкой' })
    public walletTypeId?: string;

    @ApiProperty({
        description: 'ID валюты',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: true,
    })
    @IsUUID('4', { message: 'ID валюты должен быть валидным UUID' })
    public currencyId: string;

    @ApiProperty({
        description: 'Активен ли кошелек',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Активность должна быть булевым значением' })
    public active?: boolean = true;

    @ApiProperty({
        description: 'Закрепить на главной странице',
        example: false,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Закрепление должно быть булевым значением' })
    public pinOnMain?: boolean = false;

    @ApiProperty({
        description: 'Закреплен ли кошелек',
        example: false,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Закрепление должно быть булевым значением' })
    public pinned?: boolean = false;

    @ApiProperty({
        description: 'Видим ли кошелек',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Видимость должна быть булевым значением' })
    public visible?: boolean = true;

    @ApiProperty({
        description: 'Месячный лимит операций',
        example: 100000,
        required: false,
    })
    @IsOptional()
    @IsInt({ message: 'Месячный лимит должен быть целым числом' })
    @Min(0, { message: 'Месячный лимит не может быть отрицательным' })
    public monthlyLimit?: number;

    @ApiProperty({
        description: 'Детали кошелька',
        required: false,
        type: WalletDetailsDto,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => WalletDetailsDto)
    public details?: WalletDetailsDto;
}
