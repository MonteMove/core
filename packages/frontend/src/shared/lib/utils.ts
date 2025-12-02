import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

import { APP_TIMEZONE } from '@/shared/config/timezone';
import { PHONE_RULES } from '@/shared/utils/constants/phone-rules';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyHandler = (value: string | number | null) => {
  if (value === null) {
    toast.error('Невозможно скопировать: значение отсутствует');
    return;
  }

  const str = String(value);

  navigator.clipboard
    .writeText(str)
    .then(() => {
      toast.success('Скопировано');
    })
    .catch((err) => {
      toast.error('Не удалось скопировать');
    });
};

export function findPhoneRule(digits: string) {
  if (!digits) return null;
  return PHONE_RULES.find((r) => digits.startsWith(r.code)) ?? null;
}

export function normalizeDigits(value: string) {
  let digits = (value ?? '').replace(/\D/g, '');

  if (digits === '8') {
    digits = '7';
  }

  const rule = findPhoneRule(digits);
  return rule ? digits.slice(0, rule.total) : digits;
}

export function formatByRule(digitsRaw?: string) {
  if (!digitsRaw) return '';

  let digits = digitsRaw.replace(/\D/g, '');
  if (!digits) return '';

  // Приведение 8 → 7 только для РФ
  if (digits === '8') digits = '7';

  const rule = findPhoneRule(digits);
  if (!rule) return '+' + digits;

  const rest = digits.slice(rule.code.length);

  // 🇷🇺 Россия
  if (rule.type === 'ru') {
    let out = '+7';
    if (rest.length > 0) out += ' (' + rest.slice(0, 3);
    if (rest.length > 3) out += ') ' + rest.slice(3, 6);
    if (rest.length > 6) out += '-' + rest.slice(6, 8);
    if (rest.length > 8) out += '-' + rest.slice(8, 10);
    return out;
  }

  // 🇺🇸 США
  if (rule.type === 'us') {
    let out = '+1';
    if (rest.length > 0) out += ' (' + rest.slice(0, 3);
    if (rest.length > 3) out += ') ' + rest.slice(3, 6);
    if (rest.length > 6) out += '-' + rest.slice(6, 10);
    return out;
  }

  // 🌍 Страны формата "space": 380, 375, 381, 382, 44, 49
  const parts: string[] = [];
  let idx = 0;

  for (const g of rule.groups) {
    if (idx >= rest.length) break;
    parts.push(rest.slice(idx, idx + g));
    idx += g;
  }

  return '+' + rule.code + (parts.length ? ' ' + parts.join(' ') : '');
}

/**
 * Форматирует дату в формат dd.MM.yyyy
 * @param date - Дата для форматирования
 * @returns Отформатированная строка даты или пустая строка
 */
export function formatDate(date: Date | undefined) {
  if (!date) {
    return '';
  }
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: APP_TIMEZONE,
  });
}

/**
 * Форматирует дату и время в формат dd.MM.yyyy, HH:mm (24-часовой формат)
 * @param date - Дата для форматирования
 * @returns Отформатированная строка даты и времени или пустая строка
 */
export function formatDateTime(date: Date | string | undefined | null): string {
  if (!date) {
    return '';
  }
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return '';
  }
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: APP_TIMEZONE,
  });
}

export function formatCardNumber(value: string | undefined) {
  const digits = (value ?? '').replace(/\D/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/**
 * Безопасно форматирует дату и время в формат dd.MM.yyyy, HH:mm (24-часовой формат)
 * Обрабатывает различные форматы входных данных
 * @param value - Строка с датой или null/undefined
 * @returns Отформатированная строка даты или сообщение об ошибке
 */
export function formatDateSafe(value?: string | null) {
  if (!value) return 'Не указано';
  const iso =
    value.includes(' ') && !value.includes('T')
      ? value.replace(' ', 'T')
      : value;
  const d = new Date(iso);
  if (!isNaN(d.getTime())) {
    return d.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: APP_TIMEZONE,
    });
  }
  const num = Number(value);
  if (!Number.isNaN(num)) {
    const d2 = new Date(num);
    if (!isNaN(d2.getTime())) {
      return d2.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: APP_TIMEZONE,
      });
    }
  }
  return 'Invalid date';
}

export function applyThemeVars(vars: Record<string, string>) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

/**
 * Форматирует число с пробелами в качестве разделителя тысяч
 * @param value - число для форматирования
 * @returns отформатированная строка
 * @example formatNumber(1000000) => "1 000 000"
 */
export const formatNumber = (value: number | string): string => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (isNaN(num)) return '';
  return num.toLocaleString('ru-RU').replace(/,/g, ' ');
};

/**
 * Парсит строку с числом, удаляя пробелы и другие нечисловые символы
 * @param value - строка для парсинга
 * @returns число или NaN если парсинг не удался
 * @example parseFormattedNumber("1 000 000") => 1000000
 */
export const parseFormattedNumber = (value: string): number => {
  const cleaned = value.replace(/\s/g, '');
  return parseInt(cleaned, 10);
};
