import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBankDto {
    @ApiProperty({
        description: 'Название банка',
        example: 'Сбербанк',
        minLength: 2,
        maxLength: 100,
    })
    @IsNotEmpty({ message: 'Название банка обязательно для заполнения' })
    @IsString({ message: 'Название банка должно быть строкой' })
    @MinLength(2, {
        message: 'Название банка должно содержать минимум 2 символа',
    })
    @MaxLength(100, {
        message: 'Название банка должно содержать максимум 100 символов',
    })
    public name: string;

    @ApiProperty({
        description: 'Код банка',
        example: 'sber',
        minLength: 2,
        maxLength: 20,
    })
    @IsNotEmpty({ message: 'Код банка обязателен для заполнения' })
    @IsString({ message: 'Код банка должен быть строкой' })
    @MinLength(2, { message: 'Код банка должен содержать минимум 2 символа' })
    @MaxLength(20, {
        message: 'Код банка должен содержать максимум 20 символов',
    })
    public code: string;

    @ApiPropertyOptional({
        description: 'Активность банка',
        example: true,
        default: true,
    })
    @IsOptional()
    @IsBoolean({ message: 'Активность должна быть булевым значением' })
    public active?: boolean;
}
