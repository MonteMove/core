export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginationResult {
    skip?: number;
    take?: number;
    shouldPaginate: boolean;
}

export interface PaginationResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Возвращает параметры для Prisma запроса с пагинацией или без неё
 * Если page и limit не переданы, возвращает { shouldPaginate: false }
 * Если переданы, возвращает { skip, take, shouldPaginate: true }
 */
export function calculatePagination(params: PaginationParams): PaginationResult {
    const { page, limit } = params;

    // Если page или limit не переданы, отключаем пагинацию
    if (page === undefined || limit === undefined) {
        return { shouldPaginate: false };
    }

    const skip = (page - 1) * limit;

    return {
        skip,
        take: limit,
        shouldPaginate: true,
    };
}

/**
 * Создает объект пагинации для ответа API
 */
export function createPaginationResponse(total: number, page: number, limit: number): PaginationResponse {
    const totalPages = Math.ceil(total / limit);

    return {
        total,
        page,
        limit,
        totalPages,
    };
}

/**
 * Создает объект пагинации для случая когда все данные загружены
 */
export function createAllDataPaginationResponse(total: number): PaginationResponse {
    return {
        total,
        page: 1,
        limit: total,
        totalPages: 1,
    };
}
