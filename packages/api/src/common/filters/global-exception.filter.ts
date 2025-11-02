import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

import { Prisma } from '../../../prisma/generated/prisma';

export interface ErrorResponse {
    statusCode: number;
    message: string;
    error: string;
    timestamp: string;
    path: string;
    details?: unknown;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    public catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Внутренняя ошибка сервера';
        let error = 'Internal Server Error';
        let details: unknown = undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse as Record<string, unknown>;

                message = (responseObj.message as string) || (responseObj.error as string) || exception.message;
                details = responseObj.details;
            }

            error = this.getErrorName(status);
        } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            ({ status, message, error } = this.handlePrismaKnownRequestError(exception));
        } else if (exception instanceof Prisma.PrismaClientValidationError) {
            ({ status, message, error } = this.handlePrismaValidationError(exception));
        } else if (exception instanceof Prisma.PrismaClientInitializationError) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
            message = 'Сервис базы данных недоступен';
            error = 'Service Unavailable';
        } else if (exception instanceof Prisma.PrismaClientRustPanicError) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Критическая ошибка базы данных';
            error = 'Database Panic';
        } else if (exception instanceof Error) {
            message = exception.message;
            error = 'Internal Server Error';
        }

        const errorResponse: ErrorResponse = {
            statusCode: status,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        if (details) {
            errorResponse.details = details;
        }

        if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                `Server Error: ${exception instanceof Error ? exception.constructor.name : 'Unknown'}`,
                exception instanceof Error ? exception.stack : undefined,
            );
        } else {
            this.logger.warn(`Client Error: ${message}`, { path: request.url, status });
        }

        response.status(status).json(errorResponse);
    }

    private getErrorName(status: number): string {
        if (status === 400) {
            return 'Bad Request';
        }
        if (status === 401) {
            return 'Unauthorized';
        }
        if (status === 403) {
            return 'Forbidden';
        }
        if (status === 404) {
            return 'Not Found';
        }
        if (status === 409) {
            return 'Conflict';
        }
        if (status === 422) {
            return 'Unprocessable Entity';
        }
        if (status === 429) {
            return 'Too Many Requests';
        }
        if (status === 500) {
            return 'Internal Server Error';
        }
        if (status === 503) {
            return 'Service Unavailable';
        }

        return 'Error';
    }

    private handlePrismaKnownRequestError(exception: Prisma.PrismaClientKnownRequestError): {
        status: number;
        message: string;
        error: string;
    } {
        const code = exception.code;
        const meta = exception.meta;

        if (code === 'P2002') {
            const target = meta?.target;
            const field = target
                ? Array.isArray(target)
                    ? target.join(', ')
                    : typeof target === 'string'
                      ? target
                      : JSON.stringify(target)
                : 'field';

            return {
                status: HttpStatus.CONFLICT,
                message: `Запись с таким значением ${field} уже существует`,
                error: 'Conflict',
            };
        }

        if (code === 'P2025') {
            return {
                status: HttpStatus.NOT_FOUND,
                message: 'Запрашиваемая запись не найдена',
                error: 'Not Found',
            };
        }

        if (code === 'P2003') {
            const fieldNameValue = meta?.field_name;
            const fieldName = fieldNameValue
                ? typeof fieldNameValue === 'string'
                    ? fieldNameValue
                    : JSON.stringify(fieldNameValue)
                : 'связанное поле';

            return {
                status: HttpStatus.BAD_REQUEST,
                message: `Ошибка внешнего ключа для поля ${fieldName}`,
                error: 'Bad Request',
            };
        }

        if (code === 'P2004') {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'Нарушение ограничения базы данных',
                error: 'Bad Request',
            };
        }

        if (code === 'P2014') {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'Операция нарушает обязательную связь между записями',
                error: 'Bad Request',
            };
        }

        if (code === 'P2016') {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: 'Ошибка интерпретации запроса',
                error: 'Bad Request',
            };
        }

        if (code === 'P2021') {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Ошибка конфигурации базы данных',
                error: 'Internal Server Error',
            };
        }

        if (code === 'P2022') {
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Ошибка схемы базы данных',
                error: 'Internal Server Error',
            };
        }

        if (code === 'P2034') {
            return {
                status: HttpStatus.CONFLICT,
                message: 'Конфликт при выполнении операции, попробуйте ещё раз',
                error: 'Conflict',
            };
        }

        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: `Ошибка базы данных: ${exception.message}`,
            error: 'Database Error',
        };
    }

    private handlePrismaValidationError(exception: Prisma.PrismaClientValidationError): {
        status: number;
        message: string;
        error: string;
    } {
        let message = 'Некорректные данные запроса';

        if (exception.message.includes('Invalid value for argument')) {
            message = 'Передано некорректное значение в один из параметров';
        } else if (exception.message.includes('Missing required argument')) {
            message = 'Отсутствует обязательный параметр';
        } else if (exception.message.includes('Unknown argument')) {
            message = 'Передан неизвестный параметр';
        } else if (exception.message.includes('Invalid Date')) {
            message = 'Передана некорректная дата';
        }

        return {
            status: HttpStatus.BAD_REQUEST,
            message,
            error: 'Validation Error',
        };
    }
}
