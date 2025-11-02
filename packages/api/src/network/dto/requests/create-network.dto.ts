import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateNetworkDto {
    @ApiProperty({
        description: 'Код сети',
        example: 'ETH',
        minLength: 2,
        maxLength: 10,
    })
    @IsNotEmpty({ message: 'Код сети обязателен для заполнения' })
    @IsString({ message: 'Код сети должен быть строкой' })
    @Length(2, 10, { message: 'Код сети должен содержать от 2 до 10 символов' })
    public code: string;

    @ApiProperty({
        description: 'Название сети',
        example: 'Ethereum',
        minLength: 2,
        maxLength: 100,
    })
    @IsNotEmpty({ message: 'Название сети обязательно для заполнения' })
    @IsString({ message: 'Название сети должно быть строкой' })
    @Length(2, 100, { message: 'Название сети должно содержать от 2 до 100 символов' })
    public name: string;
}
