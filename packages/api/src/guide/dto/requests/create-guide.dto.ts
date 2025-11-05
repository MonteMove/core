import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGuideDto {
    @ApiProperty({
        description: 'Описание гида',
        example: 'Опытный гид с 5-летним стажем работы в туризме',
        maxLength: 1000,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Описание должно быть строкой' })
    @MaxLength(1000, { message: 'Описание не должно превышать 1000 символов' })
    public description?: string;

    @ApiProperty({
        description: 'Полное имя гида',
        example: 'Иванов Иван Иванович',
        maxLength: 200,
        required: true,
    })
    @IsNotEmpty({ message: 'Полное имя обязательно для заполнения' })
    @IsString({ message: 'Полное имя должно быть строкой' })
    @MaxLength(200, { message: 'Полное имя не должно превышать 200 символов' })
    public fullName: string;

    @ApiProperty({
        description: 'Номер телефона гида',
        example: '+7 (999) 123-45-67',
        maxLength: 20,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Телефон должен быть строкой' })
    @MaxLength(20, { message: 'Телефон не должен превышать 20 символов' })
    public phone?: string;

    @ApiProperty({
        description: 'Номер банковской карты гида',
        example: '1234 5678 9012 3456',
        maxLength: 50,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Номер карты должен быть строкой' })
    @MaxLength(50, { message: 'Номер карты не должен превышать 50 символов' })
    public cardNumber?: string;

    @ApiProperty({
        description: 'Дата рождения гида',
        example: '15.03.1985',
        maxLength: 100,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Дата рождения должна быть строкой' })
    @MaxLength(100, { message: 'Дата рождения не должна превышать 100 символов' })
    public birthDate?: string;

    @ApiProperty({
        description: 'Адрес гида',
        example: 'г. Москва, ул. Тверская, д. 1, кв. 10',
        maxLength: 500,
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Адрес должен быть строкой' })
    @MaxLength(500, { message: 'Адрес не должен превышать 500 символов' })
    public address?: string;
}
