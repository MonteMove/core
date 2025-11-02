import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetWalletDailyOperationsDto {
    @ApiProperty({
        description: 'Номер страницы',
        example: 1,
        minimum: 1,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Номер страницы должен быть числом' })
    @Min(1, { message: 'Номер страницы должен быть больше 0' })
    public page?: number = 1;

    @ApiProperty({
        description: 'Размер страницы',
        example: 30,
        minimum: 1,
        maximum: 100,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Размер страницы должен быть числом' })
    @Min(1, { message: 'Размер страницы должен быть больше 0' })
    @Max(100, { message: 'Размер страницы не должен превышать 100' })
    public limit?: number = 30;

    @ApiProperty({
        description: 'Дата начала периода',
        example: '2024-01-01T00:00:00.000Z',
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'Дата начала должна быть валидной датой' })
    public startDate?: string;

    @ApiProperty({
        description: 'Дата окончания периода',
        example: '2024-12-31T23:59:59.999Z',
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'Дата окончания должна быть валидной датой' })
    public endDate?: string;
}
