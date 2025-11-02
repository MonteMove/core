import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class DeactivateSessionsDto {
    @ApiPropertyOptional({
        description: 'ID сессии, которую необходимо оставить активной',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsOptional()
    @IsUUID('4', { message: 'ID сессии должен быть валидным UUID' })
    public excludeSessionId?: string;
}
