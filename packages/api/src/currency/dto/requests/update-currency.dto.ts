import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCurrencyDto {
  @ApiProperty({
    description: 'Код валюты',
    example: 'USD',
    minLength: 2,
    maxLength: 10,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Код валюты должен быть строкой' })
  @MinLength(2, { message: 'Код валюты должен содержать минимум 2 символа' })
  @MaxLength(10, {
    message: 'Код валюты должен содержать максимум 10 символов',
  })
  public code?: string;

  @ApiProperty({
    description: 'Название валюты',
    example: 'Доллар США',
    minLength: 2,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Название валюты должно быть строкой' })
  @MinLength(2, {
    message: 'Название валюты должно содержать минимум 2 символа',
  })
  @MaxLength(100, {
    message: 'Название валюты должно содержать максимум 100 символов',
  })
  public name?: string;
}
