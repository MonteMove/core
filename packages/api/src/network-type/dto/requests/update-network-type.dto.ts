import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class UpdateNetworkTypeDto {
    @ApiProperty({
        description: 'ID сети, к которой относится тип',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: false,
        format: 'uuid',
    })
    @IsOptional()
    @IsUUID('4', { message: 'ID сети должен быть валидным UUID' })
    public networkId?: string;

    @ApiProperty({
        description: 'Обновлённый код типа сети',
        example: 'ERC20',
        minLength: 2,
        maxLength: 20,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Код типа сети должен быть строкой' })
    @Length(2, 20, {
        message: 'Код типа сети должен содержать от 2 до 20 символов',
    })
    public code?: string;

    @ApiProperty({
        description: 'Обновлённое название типа сети',
        example: 'Tether USDT (ERC-20)',
        minLength: 2,
        maxLength: 100,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Название типа сети должно быть строкой' })
    @Length(2, 100, {
        message: 'Название типа сети должно содержать от 2 до 100 символов',
    })
    public name?: string;
}
