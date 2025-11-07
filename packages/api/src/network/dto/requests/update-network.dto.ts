import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateNetworkDto {
    @ApiProperty({
        description: 'Обновлённый код сети',
        example: 'ETH',
        minLength: 2,
        maxLength: 10,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Код сети должен быть строкой' })
    @Length(2, 10, { message: 'Код сети должен содержать от 2 до 10 символов' })
    public code?: string;

    @ApiProperty({
        description: 'Обновлённое название сети',
        example: 'Ethereum',
        minLength: 2,
        maxLength: 100,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Название сети должно быть строкой' })
    @Length(2, 100, {
        message: 'Название сети должно содержать от 2 до 100 символов',
    })
    public name?: string;

    @ApiPropertyOptional({
        description: 'Активность сети',
        example: true,
    })
    @IsOptional()
    @IsBoolean({ message: 'Активность должна быть булевым значением' })
    public active?: boolean;
}
