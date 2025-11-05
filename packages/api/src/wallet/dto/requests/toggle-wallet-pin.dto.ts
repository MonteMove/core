import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleWalletPinDto {
    @ApiProperty({
        description: 'Закрепить/открепить кошелек',
        example: true,
    })
    @IsNotEmpty({ message: 'Значение pinned обязательно' })
    @IsBoolean({ message: 'pinned должен быть boolean' })
    public pinned: boolean;

    @ApiProperty({
        description: 'Закрепить/открепить на главной',
        example: false,
    })
    @IsNotEmpty({ message: 'Значение pinOnMain обязательно' })
    @IsBoolean({ message: 'pinOnMain должен быть boolean' })
    public pinOnMain: boolean;
}
