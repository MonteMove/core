import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateNetworkTypeDto {
    @ApiProperty({
        description: 'ID сети, к которой относится тип',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    })
    @IsNotEmpty({ message: 'ID сети обязателен для заполнения' })
    @IsUUID('4', { message: 'ID сети должен быть валидным UUID' })
    public networkId: string;

    @ApiProperty({
        description: 'Код типа сети',
        example: 'TRC20',
        minLength: 2,
        maxLength: 20,
    })
    @IsNotEmpty({ message: 'Код типа сети обязателен для заполнения' })
    @IsString({ message: 'Код типа сети должен быть строкой' })
    @Length(2, 20, {
        message: 'Код типа сети должен содержать от 2 до 20 символов',
    })
    public code: string;

    @ApiProperty({
        description: 'Человекочитаемое название типа сети',
        example: 'Tether USDT (TRC-20)',
        minLength: 2,
        maxLength: 100,
    })
    @IsNotEmpty({ message: 'Название типа сети обязательно для заполнения' })
    @IsString({ message: 'Название типа сети должно быть строкой' })
    @Length(2, 100, {
        message: 'Название типа сети должно содержать от 2 до 100 символов',
    })
    public name: string;
}
