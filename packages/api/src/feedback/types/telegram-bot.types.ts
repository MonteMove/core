export enum TelegramBotType {
    FEEDBACK = 'FEEDBACK',
}

export interface TelegramBotConfig {
    token: string;
    chatId: string;
}
