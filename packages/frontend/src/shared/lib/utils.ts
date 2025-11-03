import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

import { SessionResponseDto } from '@/entities/session/model/session-schemas';
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
      toast.success(`Успешно скопировано: ${str}`);
    })
    .catch((err) => {
      toast.error(`Не удалось скопировать: ${err}`);
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

  if (digits === '8') digits = '7';

  const rule = findPhoneRule(digits);
  if (!rule) return '+' + digits;

  const rest = digits.slice(rule.code.length);

  if (rule.type === 'ru') {
    let out = '+7';
    if (rest.length > 0) out += ' (' + rest.slice(0, 3);
    if (rest.length > 3) out += ') ' + rest.slice(3, 6);
    if (rest.length > 6) out += '-' + rest.slice(6, 8);
    if (rest.length > 8) out += '-' + rest.slice(8, 10);
    return out;
  }

  if (rule.type === 'us') {
    let out = '+1';
    if (rest.length > 0) out += ' (' + rest.slice(0, 3);
    if (rest.length > 3) out += ') ' + rest.slice(3, 6);
    if (rest.length > 6) out += '-' + rest.slice(6, 10);
    return out;
  }

  const parts: string[] = [];
  let idx = 0;
  for (const g of rule.groups) {
    if (idx >= rest.length) break;
    parts.push(rest.slice(idx, idx + g));
    idx += g;
  }

  return '+' + rule.code + (parts.length ? ' ' + parts.join(' ') : '');
}

export function formatDate(date: Date | undefined) {
  if (!date) {
    return '';
  }
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatCardNumber(value: string | undefined) {
  const digits = (value ?? '').replace(/\D/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function getCurrentSessionId(
  sessions: SessionResponseDto[],
): string | null {
  const now = new Date();
  const current = sessions.find(
    (s) => !s.revoked && new Date(s.expiresAt) > now,
  );
  return current ? current.id : null;
}

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
