import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUserId, CurrentUsername } from '../auth/decorators';
import { CreateFeedbackDto } from './dto/requests/create-feedback.dto';
import { SendFeedbackUseCase } from './use-cases/send-feedback.use-case';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
    constructor(private readonly sendFeedbackUseCase: SendFeedbackUseCase) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Отправить обратную связь',
        description: 'Отправляет сообщение с обратной связью в Telegram',
    })
    @ApiResponse({
        status: 201,
        description: 'Обратная связь успешно отправлена',
    })
    @ApiResponse({
        status: 400,
        description: 'Некорректные данные',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка при отправке в Telegram',
    })
    public async sendFeedback(
        @CurrentUserId() userId: string,
        @CurrentUsername() username: string,
        @Body() dto: CreateFeedbackDto,
    ): Promise<void> {
        await this.sendFeedbackUseCase.execute({
            ...dto,
            userId,
            username,
        });
    }
}
