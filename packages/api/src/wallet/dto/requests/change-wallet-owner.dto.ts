import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ChangeWalletOwnerDto {
    @ApiProperty({
        description: 'ID нового держателя кошелька',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty({ message: 'ID держателя не может быть пустым' })
    @IsUUID('4', { message: 'ID держателя должен быть валидным UUID' })
    public newOwnerId: string;
}
