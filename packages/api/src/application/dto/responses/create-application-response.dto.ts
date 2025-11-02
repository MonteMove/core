import { ApiProperty } from '@nestjs/swagger';

import { ApplicationResponseDto } from './application-response.dto';

export class CreateApplicationResponseDto {
    @ApiProperty({ description: 'Сообщение о результате', example: 'Заявка успешно создана' })
    public message: string;

    @ApiProperty({ description: 'Информация о созданной заявке', type: ApplicationResponseDto })
    public application: ApplicationResponseDto;
}
