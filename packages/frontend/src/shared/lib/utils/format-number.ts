/**
 * Форматирует число с пробелами в качестве разделителя тысяч
 * @param value - число для форматирования
 * @returns отформатированная строка
 * @example formatNumber(1000000) => "1 000 000"
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString('ru-RU').replace(/,/g, ' ');
};
