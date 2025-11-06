import { useEffect, useMemo, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import {
  type CalculationResult,
  CalculatorError,
  type CalculatorInput,
  type Country,
  type MeetingPlace,
  type ProfitConfig,
  type PurchaseInputCurrency,
  type PurchaseOutputCurrency,
  type SaleInputCurrency,
  type SaleOutputCurrency,
  calculate,
} from '@/entities/calculator/model/calculator';
import { type FintechRate } from '@/entities/calculator/model/rates';
import { useRatesSnapshot } from '@/entities/calculator/model/use-rates-snapshot';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared';
import { Button } from '@/shared';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared';
import { Progress } from '@/shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared';
import { Input } from '@/shared/ui/shadcn/input';
import { Switch } from '@/shared/ui/shadcn/switch';

type ProfitMode = 'tier' | 'custom' | 'trusted';

const saleInputCurrencies = [
  'RUB',
  'EUR',
  'USD_WHITE',
  'USD_BLUE',
] as const satisfies Readonly<SaleInputCurrency[]>;
const saleOutputCurrencies = ['EUR', 'RSD'] as const satisfies Readonly<
  SaleOutputCurrency[]
>;
const purchaseInputCurrencies = ['EUR', 'RSD'] as const satisfies Readonly<
  PurchaseInputCurrency[]
>;
const purchaseOutputCurrencies = [
  'RUB',
  'EUR',
  'USD_WHITE',
  'USD_BLUE',
] as const satisfies Readonly<PurchaseOutputCurrency[]>;
const meetingPlaces = [
  'msk_office',
  'msk_field',
  'regions',
] as const satisfies Readonly<MeetingPlace[]>;

const currencyLabels: Record<string, string> = {
  RUB: 'RUB',
  EUR: 'EUR',
  USD_WHITE: 'USD бел.',
  USD_BLUE: 'USD син.',
  RSD: 'RSD',
};

const meetingPlaceLabels: Record<MeetingPlace, string> = {
  msk_office: 'МСК офис',
  msk_field: 'МСК выезд',
  regions: 'Регионы',
};

const scenarioLabels: Record<'sale' | 'purchase', string> = {
  sale: 'Продажа',
  purchase: 'Покупка',
};

const countryLabels: Record<string, string> = {
  russia: 'РФ',
  serbia: 'Сербия',
  montenegro: 'Черногория',
};

const SESSION_DURATION_MS = 10 * 60 * 1000;

const formSchema = z
  .object({
    scenario: z.enum(['sale', 'purchase'] as const),
    fromCountry: z.enum(['russia', 'montenegro', 'serbia'] as const),
    toCountry: z.enum(['russia', 'montenegro', 'serbia'] as const),
    inputCurrency: z.string().min(1, 'Выберите входящую валюту'),
    outputCurrency: z.string().min(1, 'Выберите валюту выдачи'),
    amount: z.coerce
      .number({ message: 'Введите сумму' })
      .positive('Сумма должна быть больше нуля')
      .optional()
      .or(z.literal('').transform(() => undefined)),
    meetingPlace: z.enum(meetingPlaces),
    expenses: z.coerce
      .number()
      .min(0, 'Расходы не могут быть отрицательными')
      .optional(),
    reverseMode: z.boolean(),
    targetAmount: z.coerce
      .number({ message: 'Введите сумму к выдаче' })
      .optional()
      .or(z.literal('').transform(() => undefined)),
  })
  .superRefine((data, ctx) => {
    if (data.scenario === 'sale') {
      if (
        !(saleInputCurrencies as readonly string[]).includes(data.inputCurrency)
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['inputCurrency'],
          message: 'Недопустимая валюта',
        });
      }
      if (
        !(saleOutputCurrencies as readonly string[]).includes(
          data.outputCurrency,
        )
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['outputCurrency'],
          message: 'Недопустимая валюта',
        });
      }
      if (data.toCountry === 'montenegro' && data.outputCurrency === 'RSD') {
        ctx.addIssue({
          code: 'custom',
          path: ['outputCurrency'],
          message: 'Для ЧГ доступен только EUR',
        });
      }
    } else {
      if (
        !(purchaseInputCurrencies as readonly string[]).includes(
          data.inputCurrency,
        )
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['inputCurrency'],
          message: 'Недопустимая валюта',
        });
      }
      if (
        !(purchaseOutputCurrencies as readonly string[]).includes(
          data.outputCurrency,
        )
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['outputCurrency'],
          message: 'Недопустимая валюта',
        });
      }
    }

    if (data.fromCountry === data.toCountry) {
      ctx.addIssue({
        code: 'custom',
        path: ['toCountry'],
        message: 'Страны отправления и получения должны быть разными',
      });
    }

    const isEurToEurAllowed =
      data.scenario === 'sale' &&
      data.inputCurrency === 'EUR' &&
      (data.toCountry === 'montenegro' || data.outputCurrency === 'EUR');

    if (data.inputCurrency === data.outputCurrency && !isEurToEurAllowed) {
      ctx.addIssue({
        code: 'custom',
        path: ['outputCurrency'],
        message: 'Исходная и целевая валюта должны быть разными',
      });
    }

    if (data.reverseMode) {
      if (data.targetAmount == null || Number(data.targetAmount) <= 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['targetAmount'],
          message: 'Укажите сумму для обратного расчёта',
        });
      }
    } else {
      if (data.amount == null || Number(data.amount) <= 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['amount'],
          message: 'Введите сумму',
        });
      }
    }

    if (
      data.meetingPlace === 'regions' &&
      (data.expenses == null || Number(data.expenses) <= 0)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['expenses'],
        message: 'Укажите расходы курьера для региональных встреч',
      });
    }
  });

type CalculatorFormSchema = typeof formSchema;
type CalculatorFormInput = z.input<CalculatorFormSchema>;
type CalculatorFormValues = z.output<CalculatorFormSchema>;

const defaultFormValues: CalculatorFormInput = {
  scenario: 'sale',
  fromCountry: 'russia',
  toCountry: 'serbia',
  inputCurrency: 'RUB',
  outputCurrency: 'EUR',
  amount: '',
  meetingPlace: 'msk_office',
  expenses: 0,
  reverseMode: false,
  targetAmount: undefined,
};

/**
 * Форматирует сумму для отображения в интерфейсе
 *
 * @param value - Сумма для форматирования
 * @param currency - Валюта суммы (влияет на количество знаков после запятой)
 * @returns Отформатированная строка суммы
 *
 * @example
 * ```typescript
 * formatAmount(1234.56, 'RUB'); // "1 234,56"
 * formatAmount(1234, 'RSD'); // "1 234"
 * ```
 */
function formatAmount(value: number, currency: string) {
  const digits = currency === 'RSD' ? 0 : 2;
  return value.toLocaleString('ru-RU', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/**
 * Форматирует курс валюты для отображения в интерфейсе
 *
 * @param value - Значение курса для форматирования
 * @returns Отформатированная строка курса с точностью до 6 знаков
 *
 * @example
 * ```typescript
 * formatRate(83.4567); // "83,456700"
 * formatRate(0.850441); // "0,850441"
 * ```
 */
function formatRate(value: number) {
  return value.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
}

/**
 * Форматирует дату/время для отображения в интерфейсе
 *
 * @param value - Строка с датой или null/undefined
 * @returns Отформатированная строка даты или символ тире для отсутствующего значения
 *
 * @example
 * ```typescript
 * formatDate('2024-01-15T10:30:00Z'); // "15.01.2024, 13:30"
 * formatDate(null); // "—"
 * formatDate('invalid-date'); // "invalid-date"
 * ```
 */
function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Форматирует курсы FinTech для отображения в интерфейсе
 *
 * @param rate - Объект с курсами покупки и продажи FinTech
 * @returns Отформатированная строка с курсами покупки и продажи
 *
 * @example
 * ```typescript
 * const rate = {
 *   buy: { value: 83.45, override: false },
 *   sell: { value: 83.65, override: false }
 * };
 * formatFintechRate(rate); // "покупка: 83,450000 · продажа: 83,650000"
 * ```
 */
function formatFintechRate(rate: FintechRate) {
  const buy = rate.buy.value;
  const sell = rate.sell.value;

  if (buy == null && sell == null) {
    return 'нет данных';
  }

  const buyText = buy == null ? 'нет данных' : formatRate(buy);
  const sellText = sell == null ? 'нет данных' : formatRate(sell);

  return `покупка: ${buyText} · продажа: ${sellText}`;
}

type ProfitState = {
  mode: ProfitMode;
  customValue: number | null;
  expiresAt?: number;
};

type CustomEurPerUsdtState = {
  value: number;
  expiresAt: number;
  country: Country;
};

/**
 * Основной компонент калькулятора валютных операций
 *
 * Предоставляет интерфейс для расчета операций обмена валюты между РФ, Сербией и Черногорией.
 *
 * Возможности:
 * - Выбор типа операции (продажа/покупка)
 * - Выбор стран отправления и получения
 * - Конфигурация валют, сумм и параметров
 * - Настройка коэффициента прибыли
 * - Реверсивный расчет (от целевой суммы к входной)
 * - Отображение детального отчета по шагам расчета
 * - Обработка ошибок и предупреждений
 *
 * Состояние компонента:
 * - Загрузка курсов валют
 * - Результаты расчета с пошаговым описанием
 * - Управление модальными окнами (прибыль, себестоимость)
 * - Валидация формы и обработка ошибок
 *
 * @returns JSX элемент компонента калькулятора
 *
 * @example
 * ```tsx
 * <CalculatorPage />
 * ```
 */
export default function CalculatorPage() {
  const {
    data: snapshot,
    isLoading,
    isError,
    error: snapshotError,
  } = useRatesSnapshot();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [profitState, setProfitState] = useState<ProfitState>({
    mode: 'tier',
    customValue: null,
  });
  const [isProfitModalOpen, setProfitModalOpen] = useState(false);
  const [profitDraft, setProfitDraft] = useState('0.98');
  const [isCostModalOpen, setCostModalOpen] = useState(false);
  const [costDraft, setCostDraft] = useState('0.99');
  const [customEurState, setCustomEurState] =
    useState<CustomEurPerUsdtState | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const form = useForm<CalculatorFormInput, undefined, CalculatorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const scenario = useWatch({ control: form.control, name: 'scenario' });
  const fromCountry = useWatch({ control: form.control, name: 'fromCountry' });
  const toCountry = useWatch({ control: form.control, name: 'toCountry' });
  const meetingPlace = useWatch({
    control: form.control,
    name: 'meetingPlace',
  });
  const reverseMode = useWatch({ control: form.control, name: 'reverseMode' });

  useEffect(() => {
    setProfitState({ mode: 'tier', customValue: null });
    setCustomEurState(null);
    setResult(null);
  }, [scenario, fromCountry, toCountry]);

  useEffect(() => {
    setProfitState((prev) => {
      if (!prev.expiresAt || Date.now() <= prev.expiresAt) return prev;
      if (prev.mode === 'custom') {
        return { mode: 'tier', customValue: null };
      }
      return prev;
    });
  }, [scenario, fromCountry, toCountry]);

  useEffect(() => {
    setCustomEurState(null);
  }, [scenario, fromCountry, toCountry]);

  useEffect(() => {
    if (meetingPlace !== 'regions') {
      form.setValue('expenses', '');
    }
  }, [meetingPlace, form]);

  useEffect(() => {
    if (!reverseMode) {
      form.setValue('targetAmount', undefined);
    }
  }, [reverseMode, form]);

  useEffect(() => {
    if (customEurState && Date.now() > customEurState.expiresAt) {
      setCustomEurState(null);
    }
  }, [customEurState]);

  useEffect(() => {
    if (
      profitState.expiresAt &&
      Date.now() > profitState.expiresAt &&
      profitState.mode === 'custom'
    ) {
      setProfitState({ mode: 'tier', customValue: null });
    }
  }, [profitState]);

  const getCurrenciesForCountry = (country: string): string[] => {
    switch (country) {
      case 'russia':
        return ['RUB', 'EUR', 'USD_WHITE', 'USD_BLUE'];
      case 'serbia':
        return ['RSD', 'EUR'];
      case 'montenegro':
        return ['EUR'];
      default:
        return [];
    }
  };

  const availableInputCurrencies = useMemo((): readonly string[] => {
    const countryCurrencies = getCurrenciesForCountry(fromCountry);

    if (scenario === 'sale') {
      return countryCurrencies.filter((currency) => {
        if (
          !snapshot &&
          (currency === 'USD_WHITE' || currency === 'USD_BLUE')
        ) {
          return false;
        }
        if (!snapshot) return true;

        if (currency === 'USD_WHITE') {
          return snapshot.fintech.usd_white.buy.value != null;
        }
        if (currency === 'USD_BLUE') {
          return snapshot.fintech.usd_blue.buy.value != null;
        }
        if (currency === 'EUR') {
          return snapshot.fintech.eur.buy.value != null;
        }
        return true;
      });
    }

    return countryCurrencies;
  }, [scenario, fromCountry, snapshot]);

  const availableOutputCurrencies = useMemo((): readonly string[] => {
    const countryCurrencies = getCurrenciesForCountry(toCountry);

    if (scenario === 'sale') {
      return countryCurrencies;
    }

    if (!snapshot) return countryCurrencies;

    return countryCurrencies.filter((currency) => {
      if (currency === 'USD_WHITE') {
        return snapshot.fintech.usd_white.sell.value != null;
      }
      if (currency === 'USD_BLUE') {
        return snapshot.fintech.usd_blue.sell.value != null;
      }
      if (currency === 'EUR') {
        return snapshot.fintech.eur.sell.value != null;
      }
      return true;
    });
  }, [scenario, toCountry, snapshot]);

  useEffect(() => {
    const currentInput = form.getValues('inputCurrency');
    const currentOutput = form.getValues('outputCurrency');

    if (scenario === 'sale') {
      if (!availableInputCurrencies.includes(currentInput)) {
        const fallback =
          availableInputCurrencies.find((c) => c === 'RUB') ||
          availableInputCurrencies.find((c) => c === 'EUR') ||
          availableInputCurrencies[0];
        if (fallback) form.setValue('inputCurrency', fallback);
      }

      if (toCountry === 'montenegro') {
        form.setValue('outputCurrency', 'EUR');
      } else if (
        !currentOutput ||
        !availableOutputCurrencies.includes(currentOutput)
      ) {
        const fallback = availableOutputCurrencies.includes('EUR')
          ? 'EUR'
          : availableOutputCurrencies[0];
        if (fallback) form.setValue('outputCurrency', fallback);
      }
    } else {
      if (fromCountry === 'montenegro') {
        form.setValue('inputCurrency', 'EUR');
      } else if (!availableInputCurrencies.includes(currentInput)) {
        const fallback = availableInputCurrencies.includes('EUR')
          ? 'EUR'
          : availableInputCurrencies[0];
        if (fallback) form.setValue('inputCurrency', fallback);
      }

      if (
        !currentOutput ||
        !availableOutputCurrencies.includes(currentOutput)
      ) {
        const fallback =
          availableOutputCurrencies.find((c) => c === 'RUB') ||
          availableOutputCurrencies.find((c) => c === 'EUR') ||
          availableOutputCurrencies[0];
        if (fallback) form.setValue('outputCurrency', fallback);
      }
    }
  }, [
    scenario,
    fromCountry,
    toCountry,
    availableInputCurrencies,
    availableOutputCurrencies,
    form,
  ]);

  useEffect(() => {
    const currentOutput = form.getValues('outputCurrency');
    if (currentOutput && !availableOutputCurrencies.includes(currentOutput)) {
      const fallback = availableOutputCurrencies[0];
      if (fallback) {
        form.setValue('outputCurrency', fallback);
      }
    }
  }, [availableOutputCurrencies, form]);

  useEffect(() => {
    if (scenario === 'sale') {
      form.setValue('fromCountry', 'russia');
      form.setValue('toCountry', 'serbia');
      form.setValue('inputCurrency', 'RUB');
      form.setValue('outputCurrency', 'EUR');
    } else if (scenario === 'purchase') {
      form.setValue('fromCountry', 'serbia');
      form.setValue('toCountry', 'russia');
      form.setValue('inputCurrency', 'EUR');
      form.setValue('outputCurrency', 'RUB');
    }
  }, [scenario, form]);

  const appliedCustomEur = useMemo(() => {
    if (!customEurState) return undefined;
    if (Date.now() > customEurState.expiresAt) {
      return undefined;
    }
    return customEurState.value;
  }, [customEurState]);

  /**
   * Строит объект входных данных для калькулятора из значений формы
   *
   * Преобразует данные формы в формат, подходящий для функции calculate():
   * - Определяет тип операции и страны
   * - Конвертирует расходы в рубли
   * - Настраивает конфигурацию прибыли
   * - Устанавливает пользовательские коэффициенты
   *
   * @param values - Значения формы калькулятора
   * @returns Объект CalculatorInput для передачи в calculate()
   *
   * @example
   * ```typescript
   * const formValues = {
   *   scenario: 'sale',
   *   fromCountry: 'russia',
   *   toCountry: 'serbia',
   *   inputCurrency: 'RUB',
   *   outputCurrency: 'EUR',
   *   amount: '100000',
   *   meetingPlace: 'msk_office',
   *   expenses: '2000'
   * };
   *
   * const input = buildCalculatorInput(formValues);
   * const result = calculate(input, snapshot);
   * ```
   */
  const buildCalculatorInput = (
    values: CalculatorFormValues,
  ): CalculatorInput => {
    let profit: ProfitConfig;

    switch (profitState.mode) {
      case 'trusted': {
        profit = { mode: 'trusted' };
        break;
      }
      case 'custom': {
        profit =
          profitState.customValue != null
            ? { mode: 'custom', coefficient: profitState.customValue }
            : { mode: 'tier' };
        break;
      }
      default: {
        profit = { mode: 'tier' };
      }
    }

    const country: Country =
      values.scenario === 'sale'
        ? values.toCountry === 'serbia'
          ? 'serbia'
          : 'montenegro'
        : values.fromCountry === 'serbia'
          ? 'serbia'
          : 'montenegro';

    let expensesRub = 0;
    if (values.meetingPlace === 'regions') {
      expensesRub = values.expenses || 0;
    }

    const shared = {
      meetingPlace: values.meetingPlace,
      expensesRub,
      profit,
      reverseMode: values.reverseMode,
      targetAmount: values.reverseMode
        ? Number(values.targetAmount)
        : undefined,
      customEurPerUsdt: appliedCustomEur,
    };

    if (values.scenario === 'sale') {
      return {
        scenario: 'sale',
        country,
        inputCurrency: values.inputCurrency as SaleInputCurrency,
        outputCurrency: values.outputCurrency as SaleOutputCurrency,
        amount: values.amount ?? 1,
        ...shared,
      };
    }

    return {
      scenario: 'purchase',
      country,
      inputCurrency: values.inputCurrency as PurchaseInputCurrency,
      outputCurrency: values.outputCurrency as PurchaseOutputCurrency,
      amount: values.amount ?? 1,
      ...shared,
    };
  };

  /**
   * Обрабатывает отправку формы калькулятора
   *
   * Выполняет следующие действия:
   * - Проверяет доступность курсов валют
   * - Строит входные данные для калькулятора
   * - Выполняет расчет через функцию calculate()
   * - Обновляет состояние результата и ошибок
   * - При реверсивном расчете обновляет поле суммы
   * - Прокручивает страницу к результатам расчета
   *
   * @param values - Значения формы для расчета
   *
   * @example
   * ```typescript
   * // Автоматически вызывается при отправке формы
   * const handleSubmit = (formValues) => {
   *   // Расчет и обновление состояния...
   * };
   * ```
   */
  const handleSubmit = (values: CalculatorFormValues) => {
    if (!snapshot) return;

    setResult(null);
    setCalcError(null);
    setIssues([]);

    try {
      const calculatorInput = buildCalculatorInput(values);
      const calculation = calculate(calculatorInput, snapshot);
      setResult(calculation);
      setCalcError(null);
      setIssues([]);

      if (values.reverseMode) {
        form.setValue('amount', calculation.inputAmount, {
          shouldValidate: true,
        });
      }

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        setTimeout(() => {
          if (resultRef.current) {
            const element = resultRef.current;
            const elementTop = element.getBoundingClientRect().top;
            const offset = 80;
            window.scrollBy({
              top: elementTop - offset,
              behavior: 'smooth',
            });
          }
        }, 200);
      }, 100);
    } catch (error) {
      if (error instanceof CalculatorError) {
        setCalcError(error.message);
        setIssues(error.issues);
      } else {
        setCalcError('Не удалось выполнить расчёт');
        setIssues([]);
      }
      setResult(null);
    }
  };

  /**
   * Открывает модальное окно настройки коэффициента прибыли
   */
  const handleProfitModalOpen = () => {
    setProfitDraft((profitState.customValue ?? 0.98).toString());
    setProfitModalOpen(true);
  };

  /**
   * Подтверждает изменение коэффициента прибыли в модальном окне
   *
   * Валидирует введенное значение и обновляет состояние прибыли.
   * Допустимый диапазон: 0 < коэффициент ≤ 1.2
   * Сохраняется на 10 минут или до смены типа операции/страны
   */
  const handleProfitModalConfirm = () => {
    const parsed = Number(profitDraft.replace(',', '.'));
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 1.2) {
      return;
    }
    setProfitState({
      mode: 'custom',
      customValue: parsed,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    });
    setProfitModalOpen(false);
  };

  const currentTgCoef = useMemo(() => {
    if (!snapshot) return null;
    const relevantCountry = scenario === 'purchase' ? fromCountry : toCountry;
    const rate =
      relevantCountry === 'serbia'
        ? snapshot.tg.serbia.eur_usdt_coefficient.value
        : snapshot.tg.montenegro.eur_usdt_coefficient.value;
    return rate ?? null;
  }, [snapshot, scenario, fromCountry, toCountry]);

  /**
   * Открывает модальное окно настройки коэффициента-множителя EUR/USDT
   */
  const handleCostModalOpen = () => {
    const initial = appliedCustomEur ?? currentTgCoef ?? 0.99;
    setCostDraft(initial.toString());
    setCostModalOpen(true);
  };

  /**
   * Подтверждает изменение коэффициента-множителя EUR/USDT в модальном окне
   *
   * Валидирует введенное значение и обновляет состояние пользовательского коэффициента.
   * Допустимый диапазон: 0 < коэффициент ≤ 2
   * Сохраняется на 10 минут или до смены типа операции/страны
   */
  const handleCostModalConfirm = () => {
    const parsed = Number(costDraft.replace(',', '.'));
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 2) {
      return;
    }
    const relevantCountry = scenario === 'purchase' ? fromCountry : toCountry;
    const mappedCountry =
      relevantCountry === 'serbia' ? 'serbia' : 'montenegro';
    setCustomEurState({
      value: parsed,
      expiresAt: Date.now() + SESSION_DURATION_MS,
      country: mappedCountry,
    });
    setCostModalOpen(false);
  };

  /**
   * Переключает режим прибыли между обычным и проверенным (1%)
   *
   * @param checked - Флаг включения режима проверенных сделок
   *
   * Логика переключения:
   * - При включении: устанавливает режим 'trusted' (1% прибыль)
   * - При выключении: возвращается к предыдущему режиму (tier/custom)
   */
  const toggleTrusted = (checked: boolean) => {
    if (checked) {
      setProfitState({
        mode: 'trusted',
        customValue: profitState.customValue,
        expiresAt: profitState.expiresAt,
      });
    } else {
      setProfitState((prev) => {
        if (prev.customValue != null) {
          return {
            mode: 'custom',
            customValue: prev.customValue,
            expiresAt: prev.expiresAt,
          };
        }
        return { mode: 'tier', customValue: null };
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <div className="w-64 space-y-2">
          <p className="text-center text-sm text-muted-foreground">
            Загрузка курсов…
          </p>
          <Progress value={undefined} className="animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center max-w-md">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Ошибка загрузки
          </h2>
          <p className="text-destructive">
            {snapshotError instanceof Error
              ? snapshotError.message
              : 'Неизвестная ошибка'}
          </p>
        </div>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-lg border bg-muted p-6 text-center max-w-md">
          <h2 className="text-lg font-semibold mb-2">Курсы недоступны</h2>
          <p className="text-muted-foreground">
            Попробуйте перезагрузить страницу
          </p>
        </div>
      </div>
    );
  }

  const updatedAtLabel = formatDate(snapshot.updated_at);
  const hasFintech =
    snapshot.fintech.usd_white.buy.value != null ||
    snapshot.fintech.usd_white.sell.value != null ||
    snapshot.fintech.usd_blue.buy.value != null ||
    snapshot.fintech.usd_blue.sell.value != null ||
    snapshot.fintech.eur.buy.value != null ||
    snapshot.fintech.eur.sell.value != null;
  const appliedProfitLabel =
    profitState.mode === 'trusted'
      ? '1% (проверенный)'
      : profitState.mode === 'custom' && profitState.customValue != null
        ? `${(profitState.customValue * 100).toFixed(2)}%`
        : 'По таблице';
  const customCostActive =
    appliedCustomEur != null &&
    customEurState != null &&
    Date.now() <= customEurState.expiresAt;
  const customCostExpires = customCostActive
    ? new Date(customEurState.expiresAt).toLocaleTimeString('ru-RU')
    : null;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Калькулятор перестановок</h1>
        <p className="text-sm text-muted-foreground">
          Последнее обновление курсов: {updatedAtLabel}
        </p>
      </header>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 rounded-lg border p-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="scenario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Тип операции <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(['sale', 'purchase'] as const).map((value) => (
                        <SelectItem key={value} value={value}>
                          {scenarioLabels[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fromCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Откуда <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {scenario === 'sale' && (
                        <>
                          <SelectItem value="russia">РФ</SelectItem>
                          <SelectItem value="montenegro">Черногория</SelectItem>
                          <SelectItem value="serbia">Сербия</SelectItem>
                        </>
                      )}
                      {scenario === 'purchase' && (
                        <>
                          <SelectItem value="montenegro">Черногория</SelectItem>
                          <SelectItem value="serbia">Сербия</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="toCountry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Куда <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {scenario === 'sale' && (
                        <>
                          <SelectItem value="serbia">Сербия</SelectItem>
                          <SelectItem value="montenegro">Черногория</SelectItem>
                        </>
                      )}
                      {scenario === 'purchase' && (
                        <SelectItem value="russia">РФ</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meetingPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Место встречи <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {meetingPlaces.map((value) => (
                        <SelectItem key={value} value={value}>
                          {meetingPlaceLabels[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inputCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Исходная валюта <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите валюту" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableInputCurrencies.map((value) => (
                        <SelectItem key={value} value={value}>
                          {currencyLabels[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="outputCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Целевая валюта <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите валюту" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableOutputCurrencies.map((value) => (
                        <SelectItem key={value} value={value}>
                          {currencyLabels[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => {
                const numericValue =
                  typeof field.value === 'number'
                    ? field.value
                    : field.value
                      ? Number(field.value)
                      : 0;
                const displayValue =
                  numericValue && !isNaN(numericValue) && numericValue !== 0
                    ? numericValue.toLocaleString('ru-RU')
                    : '';

                return (
                  <FormItem>
                    <FormLabel>
                      {reverseMode ? 'Сумма' : 'Сумма'}
                      {!reverseMode && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          disabled={reverseMode}
                          placeholder="100 000"
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          onChange={(event) => {
                            const rawValue = event.target.value.replace(
                              /[\s,]/g,
                              '',
                            );
                            if (
                              rawValue === '' ||
                              /^\d*\.?\d*$/.test(rawValue)
                            ) {
                              field.onChange(rawValue);
                            }
                          }}
                          value={displayValue}
                          className="pr-10"
                        />
                        {displayValue && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                            onClick={() => field.onChange('')}
                            title="Очистить поле"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="reverseMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Реверсивный расчёт</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-sm text-muted-foreground">
                        Отталкиваемся от суммы выдачи
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {reverseMode && (
              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => {
                  const numericValue =
                    typeof field.value === 'number'
                      ? field.value
                      : field.value
                        ? Number(field.value)
                        : 0;
                  const displayValue =
                    numericValue && !isNaN(numericValue) && numericValue !== 0
                      ? numericValue.toLocaleString('ru-RU')
                      : '';

                  return (
                    <FormItem>
                      <FormLabel>
                        Итого к выдаче{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="95 000"
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            onChange={(event) => {
                              const rawValue = event.target.value.replace(
                                /[\s,]/g,
                                '',
                              );
                              if (
                                rawValue === '' ||
                                /^\d*\.?\d*$/.test(rawValue)
                              ) {
                                field.onChange(rawValue);
                              }
                            }}
                            value={displayValue}
                            className="pr-10"
                          />
                          {displayValue && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                              onClick={() => field.onChange('')}
                              title="Очистить поле"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}

            {meetingPlace === 'regions' && (
              <FormField
                control={form.control}
                name="expenses"
                render={({ field }) => {
                  const numericValue =
                    typeof field.value === 'number'
                      ? field.value
                      : field.value
                        ? Number(field.value)
                        : 0;
                  const displayValue =
                    numericValue && !isNaN(numericValue) && numericValue !== 0
                      ? numericValue.toLocaleString('ru-RU')
                      : '';

                  return (
                    <FormItem>
                      <FormLabel>
                        Расходы на билеты/отель, RUB
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="Обязательно"
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            onChange={(event) => {
                              const rawValue = event.target.value.replace(
                                /[\s,]/g,
                                '',
                              );
                              if (
                                rawValue === '' ||
                                /^\d*\.?\d*$/.test(rawValue)
                              ) {
                                field.onChange(rawValue);
                              }
                            }}
                            value={displayValue}
                            className="pr-10"
                            required={true}
                          />
                          {displayValue && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                              onClick={() => field.onChange('')}
                              title="Очистить поле"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}
          </div>

          <div className="space-y-3 rounded-md border bg-muted/30 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Прибыль</p>
                <p className="text-xs text-muted-foreground">
                  Текущий режим: {appliedProfitLabel}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={profitState.mode === 'trusted'}
                    onCheckedChange={toggleTrusted}
                  />
                  <label>Сделка с проверенным (1%)</label>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={profitState.mode === 'trusted'}
                  onClick={handleProfitModalOpen}
                  className="w-full sm:w-auto"
                >
                  Изменить процент прибыли
                </Button>
              </div>
            </div>
            {profitState.customValue != null && (
              <p className="text-xs text-muted-foreground">
                Пользовательский коэффициент прибыли:{' '}
                {(profitState.customValue * 100).toFixed(2)}%
                <br />
                {profitState.expiresAt ? (
                  <>
                    действует до{' '}
                    {new Date(profitState.expiresAt).toLocaleTimeString(
                      'ru-RU',
                    )}
                    <br />
                    (или до смены типа операции/страны)
                  </>
                ) : (
                  'действует до смены типа операции или страны.'
                )}
              </p>
            )}
          </div>

          {scenario === 'purchase' && fromCountry && (
            <div className="space-y-3 rounded-md border bg-muted/30 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Себестоимость EUR/USDT</p>
                  <p className="text-xs text-muted-foreground">
                    Текущее значение:{' '}
                    {appliedCustomEur?.toFixed(6) ??
                      currentTgCoef?.toFixed(6) ??
                      '—'}{' '}
                    {customCostActive && customCostExpires
                      ? `(до ${customCostExpires})`
                      : ''}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCostModalOpen}
                  className="w-full sm:w-auto"
                >
                  Изменить себестоимость
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Пользовательский коэффициент-множитель действует 10 минут либо
                до изменения типа операции/страны.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
            <span className="font-medium">Откуда:</span>
            <span>{countryLabels[fromCountry]}</span>
            <span className="font-medium">Куда:</span>
            <span>{countryLabels[toCountry]}</span>
          </div>

          <Button type="submit" className="w-full sm:w-auto">
            Рассчитать
          </Button>
        </form>
      </Form>

      {calcError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4">
          <p className="font-medium text-destructive">{calcError}</p>
          {issues.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-destructive">
              {issues.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {result && (
        <div ref={resultRef} className="space-y-6">
          {result.warnings.length > 0 && (
            <section className="rounded-lg border border-yellow-300/60 bg-yellow-50 p-4">
              <h3 className="text-lg font-semibold text-yellow-800">
                Предупреждения
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-yellow-800">
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-3">
              Итоговая сумма к выдаче
            </h2>

            <div className="mb-3">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {scenarioLabels[result.scenario]} · {countryLabels[fromCountry]}{' '}
                → {countryLabels[toCountry]}
              </p>
            </div>

            {reverseMode && result.targetAmount ? (
              <>
                <p className="text-xl font-bold">
                  {formatAmount(result.inputAmount, result.inputCurrency)}{' '}
                  {currencyLabels[result.inputCurrency] ?? result.inputCurrency}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Реверсивный расчет: для выдачи{' '}
                  {formatAmount(result.targetAmount, result.outputCurrency)}{' '}
                  {currencyLabels[result.outputCurrency] ??
                    result.outputCurrency}
                </p>
              </>
            ) : (
              <p className="text-xl font-bold">
                {formatAmount(result.outputAmount, result.outputCurrency)}{' '}
                {currencyLabels[result.outputCurrency] ?? result.outputCurrency}
              </p>
            )}

            {result.fintechTimestamp && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs font-medium text-primary">
                  FinTech курсы от: {formatDate(result.fintechTimestamp)}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-lg border p-4 space-y-3">
            <h3 className="text-lg font-semibold">Логика расчета</h3>
            <div className="text-sm bg-muted/30 rounded p-3">
              {result.scenario === 'sale' ? (
                <p>
                  <strong>Продажа:</strong> Берем{' '}
                  {formatAmount(result.inputAmount, result.inputCurrency)}{' '}
                  {currencyLabels[result.inputCurrency]}
                  {result.inputCurrency === 'EUR' &&
                  result.outputCurrency === 'EUR'
                    ? ' (прямая конвертация в Черногории)'
                    : result.inputCurrency !== 'RUB'
                      ? ', меняем на рубли через FinTech'
                      : ''}
                  , вычитаем вознаграждение сотрудника в РФ
                  {result.expenses ? ', вычитаем расходы курьера' : ''}
                  {result.inputCurrency !== 'EUR' ||
                  result.outputCurrency !== 'EUR'
                    ? ', несем в Rapira и покупаем USDT, за эти USDT в ' +
                      (result.country === 'serbia' ? 'Сербии' : 'Черногории') +
                      ' покупаем '
                    : ''}
                  {currencyLabels[result.outputCurrency]}, убираем из этой суммы{' '}
                  {((1 - result.profitCoefficient) * 100).toFixed(1)}% (наша
                  прибыль), выдаем клиенту.
                </p>
              ) : (
                <p>
                  <strong>Покупка:</strong> Берем{' '}
                  {formatAmount(result.inputAmount, result.inputCurrency)}{' '}
                  {currencyLabels[result.inputCurrency]}
                  {result.inputCurrency === 'RSD'
                    ? `, меняем на EUR по курсу ${formatRate(snapshot.business.rsd_per_eur.value ?? 0)}`
                    : ''}
                  , продаем за USDT
                  {result.warnings.includes(
                    'Использован пользовательский коэффициент-множитель EUR/USDT',
                  )
                    ? ' (пользовательский коэффициент-множитель)'
                    : ''}
                  , покупаем в Rapira за эти USDT рубли, вычитаем вознаграждение
                  сотрудника в РФ,{' '}
                  {result.outputCurrency !== 'RUB'
                    ? 'несем рубли в FinTech и меняем на нужную валюту,'
                    : ''}{' '}
                  убираем из этой суммы{' '}
                  {((1 - result.profitCoefficient) * 100).toFixed(1)}% (наша
                  прибыль)
                  {result.expenses ? ', вычитаем расходы' : ''}, выдаем клиенту.
                </p>
              )}
            </div>
          </section>

          <section className="space-y-3 rounded-lg border p-4">
            <h3 className="text-lg font-semibold">Отчёт по шагам (подробно)</h3>
            <ul className="space-y-4 text-sm">
              {result.steps.map((step, index) => (
                <li
                  key={`${step.label}-${index}`}
                  className="rounded bg-muted/30 p-3"
                >
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <span className="font-bold text-base">
                      Шаг {index + 1}: {step.label}
                    </span>
                    <span className="font-bold text-base">
                      {formatAmount(step.amount, step.currency)}{' '}
                      {currencyLabels[step.currency] ?? step.currency}
                    </span>
                  </div>
                  {step.formula && (
                    <div className="mt-2 p-3 bg-white border border-gray-300 rounded">
                      <div className="font-mono text-sm font-medium text-gray-800">
                        {step.formula}
                      </div>
                    </div>
                  )}
                  {step.rate && (
                    <div className="mt-2 p-2 bg-background rounded text-xs">
                      <div className="font-medium mb-1">
                        Курс: {step.rate.label}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {formatRate(step.rate.value)}
                        </span>
                        {step.rate.source && (
                          <span className="text-muted-foreground">
                            ({step.rate.source})
                          </span>
                        )}
                        {step.rate.override && (
                          <span className="inline-flex rounded-full border border-yellow-500 bg-yellow-50 px-2 py-0.5 text-yellow-700">
                            override
                          </span>
                        )}
                        {step.rate.fallbackUsed && (
                          <span className="inline-flex rounded-full border border-orange-500 bg-orange-50 px-2 py-0.5 text-orange-700">
                            fallback
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {step.note && (
                    <div className="mt-2 p-2 bg-muted border rounded text-xs">
                      <span className="font-medium">Примечание: </span>
                      {step.note}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border p-4 space-y-2 text-sm">
            <h3 className="text-lg font-semibold">Маржа</h3>
            <p>
              Тир:{' '}
              {result.marginTier
                ? `от ${formatAmount(result.marginTier.min_eur, 'EUR')}${result.marginTier.max_eur ? ` до ${formatAmount(result.marginTier.max_eur, 'EUR')}` : '+'}`
                : 'не найден'}
            </p>
            <p>Коэффициент: {result.profitCoefficient.toFixed(6)}</p>
            <p>
              Сумма до маржи:{' '}
              {formatAmount(
                result.margin.baseAmount,
                result.margin.baseCurrency,
              )}{' '}
              {currencyLabels[result.margin.baseCurrency] ??
                result.margin.baseCurrency}
            </p>
            <p>
              Сумма после маржи:{' '}
              {formatAmount(
                result.margin.afterAmount,
                result.margin.afterCurrency,
              )}{' '}
              {currencyLabels[result.margin.afterCurrency] ??
                result.margin.afterCurrency}
            </p>
          </section>

          {result.employeeCommission && (
            <section className="rounded-lg border p-4 space-y-2 text-sm">
              <h3 className="text-lg font-semibold">
                Вознаграждение сотрудника в РФ
              </h3>
              <div className="space-y-1">
                <p className="font-medium">
                  Объем сделки:{' '}
                  {formatAmount(result.employeeCommission.eurEquivalent, 'EUR')}{' '}
                  EUR
                </p>
                <p className="font-medium">
                  Вознаграждение:{' '}
                  {formatAmount(result.employeeCommission.usd, 'USD')} USD
                  <span className="text-xs text-muted-foreground ml-2">
                    (базовое 20 USD + комиссия по таблице)
                  </span>
                </p>
                <p>
                  Эквивалент в рублях:{' '}
                  {formatAmount(result.employeeCommission.rub, 'RUB')} RUB
                  <span className="text-xs text-muted-foreground ml-2">
                    (курс USD/RUB:{' '}
                    {formatRate(
                      result.employeeCommission.rub /
                        result.employeeCommission.usd,
                    )}
                    )
                  </span>
                </p>
              </div>
            </section>
          )}

          {result.expenses && (
            <section className="rounded-lg border p-4 space-y-2 text-sm">
              <h3 className="text-lg font-semibold">
                Расходы курьера (билеты/отель)
              </h3>
              <div className="space-y-1">
                <p className="font-medium">
                  Расходы в рублях: {formatAmount(result.expenses.rub, 'RUB')}{' '}
                  RUB
                </p>
                {result.expenses.currency !== 'RUB' && (
                  <p>
                    Эквивалент в {currencyLabels[result.expenses.currency]}:{' '}
                    {formatAmount(
                      result.expenses.converted,
                      result.expenses.currency,
                    )}{' '}
                    {currencyLabels[result.expenses.currency] ??
                      result.expenses.currency}
                  </p>
                )}
              </div>
            </section>
          )}

          {result.scenario === 'purchase' &&
            result.inputCurrency === 'EUR' &&
            result.outputCurrency === 'RUB' &&
            (result.rubPerEurCalc || result.cbrRubPerEur) && (
              <section className="rounded-lg border p-4 space-y-2">
                <h3 className="text-lg font-semibold">Дополнительно</h3>
                {result.rubPerEurCalc && (
                  <p>
                    Расчетный курс RUB/EUR:{' '}
                    {formatAmount(result.rubPerEurCalc, 'RUB')}
                    <span className="text-sm text-muted-foreground ml-2">
                      (={formatAmount(result.outputAmount, 'RUB')} ÷{' '}
                      {formatAmount(result.inputAmount, 'EUR')})
                    </span>
                  </p>
                )}
                {result.cbrRubPerEur && (
                  <p className="text-sm text-muted-foreground">
                    Для сравнения, курс ЦБ EUR:{' '}
                    {formatAmount(result.cbrRubPerEur, 'RUB')}
                  </p>
                )}
              </section>
            )}

          <section className="rounded-lg border p-4 space-y-3">
            <h3 className="text-lg font-semibold">Курсы и коэффициенты</h3>
            <div className="grid gap-2 text-sm">
              {hasFintech && (
                <div className="space-y-1">
                  <p className="font-medium text-muted-foreground">
                    FinTech Exchange:
                  </p>
                  <div className="pl-4 space-y-1">
                    <p>
                      • USD «белый»:{' '}
                      {formatFintechRate(snapshot.fintech.usd_white)}
                    </p>
                    <p>
                      • USD «синий»:{' '}
                      {formatFintechRate(snapshot.fintech.usd_blue)}
                    </p>
                    <p>• EUR: {formatFintechRate(snapshot.fintech.eur)}</p>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <p className="font-medium text-muted-foreground">Rapira:</p>
                <div className="pl-4 space-y-1">
                  <p>• USDT/RUB: {formatRate(snapshot.rapira.value || 0)}</p>
                  <p>
                    • Комиссия:{' '}
                    {((1 - snapshot.business.rapira_multiplier) * 100).toFixed(
                      1,
                    )}
                    %
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-muted-foreground">XE:</p>
                <div className="pl-4">
                  <p>
                    • USD/EUR:{' '}
                    {formatRate(snapshot.usd_variants.usd.value || 0)}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-muted-foreground">
                  TG боты коэффициенты:
                </p>
                <div className="pl-4 space-y-1">
                  <p>
                    • Сербия:{' '}
                    {formatRate(
                      snapshot.tg.serbia.eur_usdt_coefficient.value || 0,
                    )}
                  </p>
                  <p>
                    • Черногория:{' '}
                    {formatRate(
                      snapshot.tg.montenegro.eur_usdt_coefficient.value || 0,
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-muted-foreground">Справочные:</p>
                <div className="pl-4 space-y-1">
                  <p>
                    • RSD/EUR:{' '}
                    {formatRate(snapshot.business.rsd_per_eur.value ?? 0)}
                  </p>
                  <p>
                    • Курс ЦБ RUB/EUR:{' '}
                    {formatRate(snapshot.cbr.rub_per_eur.value || 0)}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-muted-foreground">
                  Конфигурация:
                </p>
                <div className="pl-4 space-y-1">
                  <p>
                    • Коэффициент прибыли: {result.profitCoefficient.toFixed(3)}{' '}
                    ({((1 - result.profitCoefficient) * 100).toFixed(1)}%)
                  </p>
                  <p>• Расходы курьера: 20 USD</p>
                </div>
              </div>
            </div>

            {result.fintechTimestamp && (
              <p className="text-xs text-muted-foreground border-t pt-2">
                FinTech пост от: {formatDate(result.fintechTimestamp)}
              </p>
            )}
          </section>
        </div>
      )}

      <AlertDialog open={isProfitModalOpen} onOpenChange={setProfitModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Изменить коэффициент прибыли</AlertDialogTitle>
            <AlertDialogDescription>
              Введите коэффициент (например, 0.98 для 2% маржи).
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Input
            type="number"
            min="0"
            max="1.2"
            step="0.001"
            value={profitDraft}
            onChange={(event) => setProfitDraft(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />

          <AlertDialogFooter>
            <AlertDialogCancel>Отменить</AlertDialogCancel>
            <AlertDialogAction onClick={handleProfitModalConfirm}>
              Применить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isCostModalOpen} onOpenChange={setCostModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {(() => {
                const relevantCountry =
                  scenario === 'purchase' ? fromCountry : toCountry;
                return relevantCountry === 'serbia' ? 'Сербия' : 'Черногория';
              })()}{' '}
              коэффициент-множитель EUR/USDT
            </AlertDialogTitle>
            <AlertDialogDescription>
              Текущий коэффициент-множитель из TG бота:{' '}
              {currentTgCoef ? currentTgCoef.toFixed(6) : '—'}. Это значение
              умножается на базовый курс USD/EUR для получения финального курса
              EUR/USDT. Новое значение будет действовать 10 минут.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Input
            type="number"
            min="0"
            max="2"
            step="0.0001"
            value={costDraft}
            onChange={(event) => setCostDraft(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />

          <AlertDialogFooter>
            <AlertDialogCancel>Отменить</AlertDialogCancel>
            <AlertDialogAction onClick={handleCostModalConfirm}>
              Применить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
