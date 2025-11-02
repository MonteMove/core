import { ApiProperty } from '@nestjs/swagger';

export class GuideResponseDto {
    @ApiProperty({ description: 'ID гида', example: '123e4567-e89b-12d3-a456-426614174000' })
    public id: string;

    @ApiProperty({
        description: 'Описание гида',
        example: 'Опытный гид с 5-летним стажем работы в туризме',
        nullable: true,
    })
    public description: string | null;

    @ApiProperty({ description: 'Полное имя гида', example: 'Иванов Иван Иванович' })
    public fullName: string;

    @ApiProperty({ description: 'Номер телефона гида', example: '+7 (999) 123-45-67', nullable: true })
    public phone: string | null;

    @ApiProperty({ description: 'Номер банковской карты гида', example: '1234 5678 9012 3456', nullable: true })
    public cardNumber: string | null;

    @ApiProperty({ description: 'Дата рождения гида', example: '15.03.1985', nullable: true })
    public birthDate: string | null;

    @ApiProperty({ description: 'Адрес гида', example: 'г. Москва, ул. Тверская, д. 1, кв. 10', nullable: true })
    public address: string | null;

    @ApiProperty({ description: 'ID создателя', example: '123e4567-e89b-12d3-a456-426614174000' })
    public userId: string;

    @ApiProperty({ description: 'ID обновившего', example: '123e4567-e89b-12d3-a456-426614174000', nullable: true })
    public updatedById: string | null;

    @ApiProperty({ description: 'Дата создания', example: '2024-01-01T00:00:00.000Z' })
    public createdAt: Date;

    @ApiProperty({ description: 'Дата обновления', example: '2024-01-01T00:00:00.000Z' })
    public updatedAt: Date;
}
