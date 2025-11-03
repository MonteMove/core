import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDto {
  @ApiProperty({ description: 'Поле с ошибкой', example: 'username' })
  public field: string;

  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Имя пользователя должно содержать минимум 3 символа',
  })
  public message: string;

  @ApiProperty({ description: 'Значение поля', example: 'ab' })
  public value: unknown;
}

export class ErrorResponseDto {
  @ApiProperty({ description: 'HTTP статус код', example: 400 })
  public statusCode: number;

  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Ошибка валидации данных',
  })
  public message: string | string[] | ValidationErrorDto[];

  @ApiProperty({
    description: 'Временная метка ошибки',
    example: '2024-01-01T00:00:00.000Z',
  })
  public timestamp: string;

  @ApiProperty({ description: 'Путь к эндпоинту', example: '/api/endpoint' })
  public path: string;
}

export class UnauthorizedErrorDto {
  @ApiProperty({ description: 'HTTP статус код', example: 401 })
  public statusCode: number;

  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Неверные учетные данные',
  })
  public message: string;

  @ApiProperty({
    description: 'Временная метка ошибки',
    example: '2024-01-01T00:00:00.000Z',
  })
  public timestamp: string;

  @ApiProperty({ description: 'Путь к эндпоинту', example: '/api/endpoint' })
  public path: string;
}

export class ForbiddenErrorDto {
  @ApiProperty({ description: 'HTTP статус код', example: 403 })
  public statusCode: number;

  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Недостаточно прав для выполнения операции',
  })
  public message: string;

  @ApiProperty({
    description: 'Временная метка ошибки',
    example: '2024-01-01T00:00:00.000Z',
  })
  public timestamp: string;

  @ApiProperty({ description: 'Путь к эндпоинту', example: '/api/endpoint' })
  public path: string;
}

export class NotFoundErrorDto {
  @ApiProperty({ description: 'HTTP статус код', example: 404 })
  public statusCode: number;

  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Ресурс не найден',
  })
  public message: string;

  @ApiProperty({
    description: 'Временная метка ошибки',
    example: '2024-01-01T00:00:00.000Z',
  })
  public timestamp: string;

  @ApiProperty({ description: 'Путь к эндпоинту', example: '/api/endpoint' })
  public path: string;
}

export class ConflictErrorDto {
  @ApiProperty({ description: 'HTTP статус код', example: 409 })
  public statusCode: number;

  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Конфликт данных',
  })
  public message: string;

  @ApiProperty({
    description: 'Временная метка ошибки',
    example: '2024-01-01T00:00:00.000Z',
  })
  public timestamp: string;

  @ApiProperty({ description: 'Путь к эндпоинту', example: '/api/endpoint' })
  public path: string;
}

export class TooManyRequestsErrorDto {
  @ApiProperty({ description: 'HTTP статус код', example: 429 })
  public statusCode: number;

  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Слишком много запросов. Попробуйте позже',
  })
  public message: string;

  @ApiProperty({
    description: 'Временная метка ошибки',
    example: '2024-01-01T00:00:00.000Z',
  })
  public timestamp: string;

  @ApiProperty({ description: 'Путь к эндпоинту', example: '/api/endpoint' })
  public path: string;
}

export class InternalServerErrorDto {
  @ApiProperty({ description: 'HTTP статус код', example: 500 })
  public statusCode: number;

  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Внутренняя ошибка сервера',
  })
  public message: string;

  @ApiProperty({
    description: 'Временная метка ошибки',
    example: '2024-01-01T00:00:00.000Z',
  })
  public timestamp: string;

  @ApiProperty({ description: 'Путь к эндпоинту', example: '/api/endpoint' })
  public path: string;
}
