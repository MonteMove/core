import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreatePlatformDto {
    @ApiProperty({
        description: 'Название платформы',
        example: 'Bybit',
        minLength: 2,
        maxLength: 100,
    })
    @IsNotEmpty({ message: 'Название платформы обязательно для заполнения' })
    @IsString({ message: 'Название платформы должно быть строкой' })
    @MinLength(2, {
        message: 'Название платформы должно содержать минимум 2 символа',
    })
    @MaxLength(100, {
        message: 'Название платформы должно содержать максимум 100 символов',
    })
    public name: string;

    @ApiProperty({
        description: 'Код платформы',
        example: 'bybit',
        minLength: 2,
        maxLength: 20,
    })
    @IsNotEmpty({ message: 'Код платформы обязателен для заполнения' })
    @IsString({ message: 'Код платформы должен быть строкой' })
    @MinLength(2, { message: 'Код платформы должен содержать минимум 2 символа' })
    @MaxLength(20, {
        message: 'Код платформы должен содержать максимум 20 символов',
    })
    public code: string;

    @ApiPropertyOptional({
        description: 'Активность платформы',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean({ message: 'Активность должна быть булевым значением' })
    public active?: boolean;
}
