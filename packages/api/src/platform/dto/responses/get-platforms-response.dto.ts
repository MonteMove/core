import { ApiProperty } from '@nestjs/swagger';

import { PlatformResponseDto } from './platform-response.dto';

export class GetPlatformsResponseDto {
    @ApiProperty({
        description: 'Список платформ',
        type: [PlatformResponseDto],
    })
    public platforms: PlatformResponseDto[];
}
