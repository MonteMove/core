import { Injectable } from '@nestjs/common';

import { CreateFeedbackDto } from '../dto/requests/create-feedback.dto';
import { TelegramService } from '../telegram.service';

interface SendFeedbackInput extends CreateFeedbackDto {
    userId: string;
    username: string;
}

@Injectable()
export class SendFeedbackUseCase {
    constructor(private readonly telegramService: TelegramService) {}

    public async execute(input: SendFeedbackInput): Promise<void> {
        await this.telegramService.sendFeedback(input.username, input.userId, input.title, input.description);
    }
}
