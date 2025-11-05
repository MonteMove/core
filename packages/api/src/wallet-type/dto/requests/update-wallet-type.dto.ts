import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateWalletTypeDto {
    @ApiProperty({
        description: 'Код типа кошелька',
        example: 'inskech',
        required: false,
        minLength: 2,
        maxLength: 50,
    })
    @IsOptional()
    @IsString({ message: 'Код должен быть строкой' })
    @MinLength(2, { message: 'Код должен содержать минимум 2 символа' })
    @MaxLength(50, { message: 'Код не должен превышать 50 символов' })
    public code?: string;

    @ApiProperty({
        description: 'Название типа кошелька',
        example: 'Инскеш',
        required: false,
        minLength: 2,
        maxLength: 100,
    })
    @IsOptional()
    @IsString({ message: 'Название должно быть строкой' })
    @MinLength(2, { message: 'Название должно содержать минимум 2 символа' })
    @MaxLength(100, { message: 'Название не должно превышать 100 символов' })
    public name?: string;

    @ApiProperty({
        description: 'Описание типа кошелька',
        example: 'Кошельки для работы с Инскеш',
        required: false,
        maxLength: 500,
    })
    @IsOptional()
    @IsString({ message: 'Описание должно быть строкой' })
    @MaxLength(500, { message: 'Описание не должно превышать 500 символов' })
    public description?: string;

    @ApiProperty({
        description: 'Показывать в отдельном табе',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'showInTabs должно быть булевым значением' })
    public showInTabs?: boolean;

    @ApiProperty({
        description: 'Порядок отображения в табах',
        example: 1,
        required: false,
        minimum: 0,
    })
    @IsOptional()
    @IsInt({ message: 'Порядок должен быть целым числом' })
    @Min(0, { message: 'Порядок не может быть отрицательным' })
    public tabOrder?: number;

    @ApiProperty({
        description: 'Активен ли тип',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'active должно быть булевым значением' })
    public active?: boolean;
}
