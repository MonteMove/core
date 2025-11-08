import type { Wallet } from '@/entities/wallet/model/wallet-schemas';

const warningText =
  'Убедительная просьба - переводить на строго указанные реквизиты, соблюдая все требования к переводу!\n' +
  'При переводе на некорректные реквизиты, а также при несоблюдении иных требований, мы не сможем провести обмен и возврат денежных средств!';

/**
 * Формирует текст реквизитов для копирования в зависимости от типа кошелька
 */
export const formatWalletRequisites = (wallet: Wallet): string | null => {
  const parts: string[] = [];
  const details = wallet.details;

  if (!details) {
    return null;
  }

  // Для криптокошельков
  if (wallet.walletKind === 'crypto') {
    // Адрес кошелька
    if (details.address) {
      parts.push(details.address);
    }

    // Сеть и тип сети
    const networkInfo: string[] = [];
    if (details.network?.name) {
      networkInfo.push(details.network.name);
    }
    if (details.networkType?.name) {
      networkInfo.push(details.networkType.name);
    }
    if (networkInfo.length > 0) {
      parts.push(`Сеть: ${networkInfo.join(' ')}`);
    }

    // UID биржи (для Bybit и подобных)
    if (details.exchangeUid) {
      parts.push(`UID: ${details.exchangeUid}`);
    }

    // Username (для платформ типа Trust Wallet)
    if (details.username) {
      parts.push(`Username: ${details.username}`);
    }

    // Платформа
    if (details.platform?.name) {
      parts.push(`Платформа: ${details.platform.name}`);
    }
  }

  // Для банковских кошельков
  if (wallet.walletKind === 'bank') {
    // Номер карты
    if (details.card) {
      parts.push(`Карта: ${details.card}`);
    }

    // Телефон
    if (details.phone) {
      parts.push(`Телефон: ${details.phone}`);
    }

    // Владелец
    if (details.ownerFullName) {
      parts.push(`Владелец: ${details.ownerFullName}`);
    }

    // Банк
    if (details.bank?.name) {
      parts.push(`Банк: ${details.bank.name}`);
    }

    // Account ID (для некоторых платежных систем)
    if (details.accountId) {
      parts.push(`ID: ${details.accountId}`);
    }
  }

  // Для простых кошельков (касса и т.д.)
  if (wallet.walletKind === 'simple') {
    // Описание из основного поля
    if (wallet.description) {
      parts.push(wallet.description);
    }

    // Дополнительные данные из details если есть
    if (details.phone) {
      parts.push(`Телефон: ${details.phone}`);
    }
    if (details.accountId) {
      parts.push(`ID: ${details.accountId}`);
    }
  }

  if (parts.length === 0) {
    return null;
  }

  return parts.join('\n');
};

/**
 * Формирует полный текст для копирования с предупреждением
 */
export const formatWalletCopyText = (wallet: Wallet): string | null => {
  const requisites = formatWalletRequisites(wallet);

  if (!requisites) {
    return null;
  }

  return `${warningText}

${requisites}`;
};

/**
 * Формирует краткий текст реквизитов для специальных случаев (Bybit, Trust и т.д.)
 */
export const formatSpecialWalletCopyText = (
  wallet: Wallet,
  template: string,
): string => {
  return `${warningText}

${template}`;
};

/**
 * Проверяет, является ли кошелек специальным (требует особой обработки)
 * Проверка по платформе из details
 */
export const isSpecialWallet = (wallet: Wallet): boolean => {
  const platformCode = wallet.details?.platform?.code;
  return platformCode === 'bybit' || platformCode === 'trust';
};

/**
 * Проверяет, является ли кошелек Bybit
 */
export const isBybitWallet = (wallet: Wallet): boolean => {
  const platformCode = wallet.details?.platform?.code;
  return platformCode === 'bybit';
};

/**
 * Проверяет, является ли кошелек Trust Wallet
 */
export const isTrustWallet = (wallet: Wallet): boolean => {
  const platformCode = wallet.details?.platform?.code;
  return platformCode === 'trust';
};

/**
 * Получает шаблон для специального кошелька
 */
export const getSpecialWalletTemplate = (wallet: Wallet): string | null => {
  const currency = wallet.currency.code;

  // Байбит - показываем шаблон для UID
  if (isBybitWallet(wallet)) {
    return `<${currency}>, UID Bybit:`;
  }

  // Траст - показываем шаблон для TRON
  if (isTrustWallet(wallet)) {
    return `<${currency}>, TRON (TRC-20):`;
  }

  return null;
};
