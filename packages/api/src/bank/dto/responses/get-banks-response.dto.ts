import { ApiProperty } from '@nestjs/swagger';

import { BankResponseDto } from './bank-response.dto';

export class GetBanksResponseDto {
    @ApiProperty({
        description: 'Список банков',
        type: [BankResponseDto],
    })
    public banks: BankResponseDto[];
}
