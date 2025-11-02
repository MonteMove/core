import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class BlockUserDto {
    @ApiProperty({
        description: 'Статус блокировки пользователя',
        example: true,
    })
    @IsBoolean({ message: 'Статус блокировки должен быть boolean' })
    public blocked: boolean;
}
