import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetWalletAnalyticsDto {
    @ApiProperty({
        description: 'ID кошелька для фильтрации',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'ID кошелька должен быть валидным UUID' })
    public walletId?: string;

    @ApiProperty({
        description: 'Код валюты для фильтрации',
        example: 'USD',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Код валюты должен быть строкой' })
    public currency?: string;

    @ApiProperty({
        description: 'Имя владельца кошелька для фильтрации',
        example: 'john_doe',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Имя владельца должно быть строкой' })
    public holder?: string;

    @ApiProperty({
        description: 'Дата начала периода',
        example: '2024-01-01T00:00:00.000Z',
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'Дата начала должна быть валидной датой' })
    public dateStart?: string;

    @ApiProperty({
        description: 'Дата окончания периода',
        example: '2024-12-31T23:59:59.999Z',
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'Дата окончания должна быть валидной датой' })
    public dateEnd?: string;

    @ApiProperty({
        description: 'Включать удаленные кошельки',
        example: false,
        required: false,
    })
    @IsOptional()
    @IsBoolean({
        message: 'Флаг включения удаленных должен быть булевым значением',
    })
    public includeDeleted?: boolean = false;

    @ApiProperty({
        description: 'Включать наличные кошельки',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean({
        message: 'Флаг включения наличных должен быть булевым значением',
    })
    public includeCash?: boolean = true;

    @ApiProperty({
        description: 'Включать Visa кошельки',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'Флаг включения Visa должен быть булевым значением' })
    public includeVisa?: boolean = true;
}
