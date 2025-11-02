import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsEnum } from 'class-validator';

import { RoleCode } from '../../../../prisma/generated/prisma';

export class UpdateUserRolesDto {
    @ApiProperty({
        description: 'Список кодов ролей пользователя',
        example: [RoleCode.admin, RoleCode.moderator],
        required: true,
        enum: RoleCode,
        isArray: true,
    })
    @IsArray({ message: 'Список ролей должен быть массивом' })
    @ArrayUnique({ message: 'Список ролей не должен содержать дубликатов' })
    @IsEnum(RoleCode, { each: true, message: 'Каждая роль должна быть валидным значением RoleCode' })
    public roleCodes: RoleCode[];
}
