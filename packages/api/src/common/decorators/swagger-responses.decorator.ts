import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import {
    ErrorResponseDto,
    ForbiddenErrorDto,
    NotFoundErrorDto,
    TooManyRequestsErrorDto,
    UnauthorizedErrorDto,
} from '../dto';

/**
 * Декоратор для стандартного ответа 401 (Неавторизован)
 */
export function ApiUnauthorizedResponse() {
    return applyDecorators(
        ApiResponse({
            status: 401,
            description: 'Неавторизован - требуется JWT токен',
            type: UnauthorizedErrorDto,
        }),
    );
}

/**
 * Декоратор для стандартного ответа 403 (Недостаточно прав)
 */
export function ApiForbiddenResponse() {
    return applyDecorators(
        ApiResponse({
            status: 403,
            description: 'Недостаточно прав - требуется роль администратора',
            type: ForbiddenErrorDto,
        }),
    );
}

/**
 * Декоратор для стандартного ответа 400 (Ошибка валидации)
 */
export function ApiValidationErrorResponse() {
    return applyDecorators(
        ApiResponse({
            status: 400,
            description: 'Ошибка валидации данных',
            type: ErrorResponseDto,
        }),
    );
}

/**
 * Декоратор для стандартного ответа 404 (Не найдено)
 */
export function ApiNotFoundResponse() {
    return applyDecorators(
        ApiResponse({
            status: 404,
            description: 'Ресурс не найден',
            type: NotFoundErrorDto,
        }),
    );
}

/**
 * Комбинированный декоратор для стандартных ответов авторизации (401, 403)
 */
export function ApiAuthResponses() {
    return applyDecorators(ApiUnauthorizedResponse(), ApiForbiddenResponse());
}

/**
 * Комбинированный декоратор для стандартных ответов CRUD операций (400, 401, 403, 404)
 */
export function ApiCrudResponses() {
    return applyDecorators(
        ApiValidationErrorResponse(),
        ApiUnauthorizedResponse(),
        ApiForbiddenResponse(),
        ApiNotFoundResponse(),
    );
}

/**
 * Комбинированный декоратор для стандартных ответов только для чтения (401, 403, 404)
 */
export function ApiReadResponses() {
    return applyDecorators(ApiUnauthorizedResponse(), ApiForbiddenResponse(), ApiNotFoundResponse());
}

/**
 * Декоратор для стандартного ответа 429 (Rate Limiting)
 */
export function ApiRateLimitResponse(limit: number = 10, ttl: number = 60000) {
    return applyDecorators(
        ApiResponse({
            status: 429,
            description: `Слишком много запросов. Лимит: ${limit} запросов в ${ttl / 1000} секунд`,
            type: TooManyRequestsErrorDto,
        }),
    );
}
