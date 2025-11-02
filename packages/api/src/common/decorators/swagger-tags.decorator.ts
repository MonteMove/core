import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

type SwaggerTagDefinition = {
    name: string;
    description: string;
};

/**
 * Глобальный реестр Swagger-тегов с описанием.
 */
export class SwaggerTagRegistry {
    private static readonly tags = new Map<string, SwaggerTagDefinition>();

    public static register(name: string, description: string): void {
        if (!this.tags.has(name)) {
            this.tags.set(name, { name, description });

            return;
        }

        const existing = this.tags.get(name);

        if (existing && existing.description !== description) {
            existing.description = description;
        }
    }

    public static getAll(): SwaggerTagDefinition[] {
        return Array.from(this.tags.values());
    }
}

/**
 * Декоратор для установки Swagger-тэга с описанием на контроллер.
 */
export function ApiTag(name: string, description: string) {
    SwaggerTagRegistry.register(name, description);

    return applyDecorators(ApiTags(name));
}
