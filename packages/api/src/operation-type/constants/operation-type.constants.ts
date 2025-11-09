/**
 * Коды системных типов операций
 * Эти типы создаются автоматически при инициализации приложения
 * и имеют специальную логику обработки
 */
export const OPERATION_TYPE_CODES = {
    /** Аванс - операция с привязкой к заявке */
    AVANS: 'avans',
    /** Корректировка - операция с одним кошельком для корректировки баланса */
    CORRECTION: 'correction',
    /** Конвертация - операция конвертации валюты с обязательным номером группы */
    CONVERSION: 'conversion',
} as const;

/**
 * Системные типы операций, у которых нельзя изменить код
 */
export const SYSTEM_OPERATION_TYPE_CODES: string[] = [
    OPERATION_TYPE_CODES.AVANS,
    OPERATION_TYPE_CODES.CORRECTION,
    OPERATION_TYPE_CODES.CONVERSION,
];

export type OperationTypeCode = (typeof OPERATION_TYPE_CODES)[keyof typeof OPERATION_TYPE_CODES];

/**
 * Добавляет флаги типа операции на основе кода
 */
export function addOperationTypeFlags<T extends { code: string }>(
    type: T,
): T & { isCorrection: boolean; isConversion: boolean; isAvans: boolean } {
    return {
        ...type,
        isCorrection: type.code === OPERATION_TYPE_CODES.CORRECTION,
        isConversion: type.code === OPERATION_TYPE_CODES.CONVERSION,
        isAvans: type.code === OPERATION_TYPE_CODES.AVANS,
    };
}
