import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFeedbackDto {
    @ApiProperty({
        description: 'Заголовок обращения',
        example: 'Проблема с авторизацией',
        maxLength: 200,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    public title: string;

    @ApiProperty({
        description: 'Описание проблемы или вопроса',
        example: 'Не могу войти в систему, выдает ошибку...',
        maxLength: 2000,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(2000)
    public description: string;
}
