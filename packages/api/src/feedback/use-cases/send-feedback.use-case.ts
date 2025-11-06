import { Injectable } from '@nestjs/common';

import { TelegramService } from '../telegram.service';
import { CreateFeedbackDto } from '../dto/requests/create-feedback.dto';

interface SendFeedbackInput extends CreateFeedbackDto {
    userId: string;
    username: string;
}

@Injectable()
export class SendFeedbackUseCase {
    constructor(private readonly telegramService: TelegramService) {}

    public async execute(input: SendFeedbackInput): Promise<void> {
        await this.telegramService.sendFeedback(
            input.username,
            input.userId,
            input.title,
            input.description,
        );
    }
}
