import { ApiProperty } from '@nestjs/swagger';

import { GuideResponseDto } from './guide-response.dto';

export class CreateGuideResponseDto {
    @ApiProperty({
        description: 'Сообщение о результате',
        example: 'Гид успешно создан',
    })
    public message: string;

    @ApiProperty({
        description: 'Информация о созданном гиде',
        type: GuideResponseDto,
    })
    public guide: GuideResponseDto;
}
