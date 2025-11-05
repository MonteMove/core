import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class UpdateOperationTypeDto {
    @ApiProperty({
        description: 'Новое название типа операции',
        example: 'Пополнение',
        minLength: 2,
        maxLength: 100,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Название типа операции должно быть строкой' })
    @Length(2, 100, {
        message: 'Название типа операции должно содержать от 2 до 100 символов',
    })
    public name?: string;

    @ApiProperty({
        description: 'Новое описание типа операции',
        example: 'Пополнение средств на счёт клиента',
        maxLength: 500,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Описание должно быть строкой' })
    @MaxLength(500, { message: 'Описание не должно превышать 500 символов' })
    public description?: string;
}
