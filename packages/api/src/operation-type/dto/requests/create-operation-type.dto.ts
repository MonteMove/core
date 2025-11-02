import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateOperationTypeDto {
    @ApiProperty({
        description: 'Название типа операции',
        example: 'Вывод средств',
        minLength: 2,
        maxLength: 100,
    })
    @IsNotEmpty({ message: 'Название типа операции обязательно для заполнения' })
    @IsString({ message: 'Название типа операции должно быть строкой' })
    @Length(2, 100, { message: 'Название типа операции должно содержать от 2 до 100 символов' })
    public name: string;

    @ApiProperty({
        description: 'Описание типа операции',
        example: 'Операция по выводу средств на внешний кошелёк',
        maxLength: 500,
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsString({ message: 'Описание должно быть строкой' })
    @MaxLength(500, { message: 'Описание не должно превышать 500 символов' })
    public description?: string;
}
