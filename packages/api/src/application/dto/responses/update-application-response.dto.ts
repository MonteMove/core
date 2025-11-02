import { ApiProperty } from '@nestjs/swagger';

import { ApplicationResponseDto } from './application-response.dto';

export class UpdateApplicationResponseDto {
    @ApiProperty({ description: 'Сообщение о результате', example: 'Заявка успешно обновлена' })
    public message: string;

    @ApiProperty({ description: 'Информация об обновленной заявке', type: ApplicationResponseDto })
    public application: ApplicationResponseDto;
}
