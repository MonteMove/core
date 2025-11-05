import { applyDecorators } from '@nestjs/common';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

/**
 * Декоратор для стандартного параметра ID
 */
export function ApiIdParam(description: string = 'Уникальный идентификатор') {
    return applyDecorators(
        ApiParam({
            name: 'id',
            description,
            example: '123e4567-e89b-12d3-a456-426614174000',
        }),
    );
}

/**
 * Декоратор для стандартных параметров пагинации
 */
export function ApiPaginationParams() {
    return applyDecorators(
        ApiQuery({
            name: 'page',
            required: false,
            description: 'Номер страницы (по умолчанию 1)',
            example: 1,
        }),
        ApiQuery({
            name: 'limit',
            required: false,
            description: 'Количество элементов на странице (по умолчанию 10)',
            example: 10,
        }),
    );
}

/**
 * Декоратор для стандартного параметра поиска
 */
export function ApiSearchParam(description: string = 'Поиск по названию') {
    return applyDecorators(
        ApiQuery({
            name: 'search',
            required: false,
            description,
        }),
    );
}

/**
 * Комбинированный декоратор для стандартных параметров списка (пагинация + поиск)
 */
export function ApiListParams(searchDescription?: string) {
    return applyDecorators(ApiPaginationParams(), ApiSearchParam(searchDescription));
}
