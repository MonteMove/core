import { ApiProperty } from '@nestjs/swagger';

import { GuideResponseDto } from './guide-response.dto';

export class UpdateGuideResponseDto {
    @ApiProperty({ description: 'Сообщение о результате', example: 'Гид успешно обновлен' })
    public message: string;

    @ApiProperty({ description: 'Информация об обновленном гиде', type: GuideResponseDto })
    public guide: GuideResponseDto;
}
