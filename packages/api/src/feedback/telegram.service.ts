import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { TelegramBotConfig, TelegramBotType } from './types/telegram-bot.types';

@Injectable()
export class TelegramService {
    private readonly logger = new Logger(TelegramService.name);
    private readonly bots: Map<TelegramBotType, TelegramBotConfig>;

    constructor(private readonly configService: ConfigService) {
        this.bots = new Map();
        this.initializeBots();
    }

    private initializeBots(): void {
        const feedbackToken = this.configService.get<string>('TELEGRAM_FEEDBACK_BOT_TOKEN');
        const feedbackChatId = this.configService.get<string>('TELEGRAM_FEEDBACK_CHAT_ID');
        
        if (feedbackToken && feedbackChatId) {
            this.bots.set(TelegramBotType.FEEDBACK, {
                token: feedbackToken,
                chatId: feedbackChatId,
            });
        }
    }

    private getBotConfig(botType: TelegramBotType): TelegramBotConfig {
        const config = this.bots.get(botType);
        if (!config) {
            throw new Error(`Telegram bot ${botType} не настроен`);
        }
        return config;
    }

    public async sendMessage(
        botType: TelegramBotType,
        message: string,
    ): Promise<void> {
        const config = this.getBotConfig(botType);

        try {
            const response = await fetch(
                `https://api.telegram.org/bot${config.token}/sendMessage`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: config.chatId,
                        text: message,
                        parse_mode: 'HTML',
                    }),
                },
            );

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Telegram API error: ${error}`);
            }

            this.logger.log(`Message sent to Telegram bot ${botType}`);
        } catch (error) {
            this.logger.error(`Failed to send message to Telegram bot ${botType}`, error);
            throw new Error('Не удалось отправить сообщение в Telegram');
        }
    }

    public async sendFeedback(
        username: string,
        userId: string,
        title: string,
        description: string,
    ): Promise<void> {
        const message = this.formatFeedbackMessage(username, userId, title, description);
        await this.sendMessage(TelegramBotType.FEEDBACK, message);
    }

    private formatFeedbackMessage(
        username: string,
        userId: string,
        title: string,
        description: string,
    ): string {
        return `
🔔 <b>Новое обращение</b>

👤 <b>Пользователь:</b> ${username}
🆔 <b>ID:</b> <code>${userId}</code>

📌 <b>Заголовок:</b>
${title}

📝 <b>Описание:</b>
${description}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
        `.trim();
    }
}
