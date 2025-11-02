import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class AdjustmentOperationDto {
    @ApiProperty({
        description: 'ID кошелька, для которого выполняется корректировка',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid',
    })
    @IsUUID('4', { message: 'ID кошелька должен быть валидным UUID' })
    public walletId: string;

    @ApiProperty({ description: 'Желаемая сумма на кошельке после корректировки', example: 5000, minimum: 0 })
    @IsNumber({}, { message: 'Целевая сумма должна быть числом' })
    @Min(0, { message: 'Целевая сумма не может быть отрицательной' })
    public targetAmount: number;

    @ApiProperty({
        description: 'ID типа операции для корректировки',
        example: '123e4567-e89b-12d3-a456-426614174100',
        format: 'uuid',
    })
    @IsUUID('4', { message: 'ID типа операции должен быть валидным UUID' })
    public typeId: string;

    @ApiProperty({
        description: 'Описание корректировочной операции',
        example: 'Корректировка баланса по результатам сверки',
        maxLength: 2000,
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsString({ message: 'Описание должно быть строкой' })
    @MaxLength(2000, { message: 'Описание не должно превышать 2000 символов' })
    public description?: string;
}
