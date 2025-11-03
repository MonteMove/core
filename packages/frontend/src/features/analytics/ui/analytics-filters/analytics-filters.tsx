'use client';

import React, { useState } from 'react';

import { ChevronDownIcon } from 'lucide-react';

import { useAnalyticsFilters } from '@/features/analytics/hook/use-analytics-filters';
import { Button } from '@/shared/ui/shadcn/button';
import { Calendar } from '@/shared/ui/shadcn/calendar';
import { Input } from '@/shared/ui/shadcn/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/shadcn/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select';

const MONTHS = [
  { value: 'January', label: 'Январь' },
  { value: 'February', label: 'Февраль' },
  { value: 'March', label: 'Март' },
  { value: 'April', label: 'Апрель' },
  { value: 'May', label: 'Май' },
  { value: 'June', label: 'Июнь' },
  { value: 'July', label: 'Июль' },
  { value: 'August', label: 'Август' },
  { value: 'September', label: 'Сентябрь' },
  { value: 'October', label: 'Октябрь' },
  { value: 'November', label: 'Ноябрь' },
  { value: 'December', label: 'Декабрь' },
];

export const AnalyticsFilters = () => {
  const { month, setFilter } = useAnalyticsFilters();
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [wallet, setWallet] = useState('');
  const [currency, setCurrency] = useState('');

  const handleResetFilters = () => {
    setWallet('');
    setCurrency('');
    setRange({ from: undefined, to: undefined });
    setFilter('month', 'all');
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4 items-end">
      <Input
        placeholder="Фильтр по названию кошелька"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        className="w-56"
      />
      <Select value={currency} onValueChange={setCurrency}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Выберите валюту" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rub">RUB</SelectItem>
          <SelectItem value="usd">USD</SelectItem>
          <SelectItem value="eur">EUR</SelectItem>
        </SelectContent>
      </Select>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-range"
            className={
              'w-64 justify-between font-normal' +
              (!(range.from && range.to) ? ' text-muted-foreground' : '')
            }
          >
            {range.from && range.to
              ? `${range.from.toLocaleDateString()} — ${range.to.toLocaleDateString()}`
              : 'Выберите период'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            captionLayout="dropdown"
            onSelect={(selected) => {
              setRange(
                selected as { from: Date | undefined; to: Date | undefined },
              );
              if (selected && selected.from && selected.to) setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      <Select
        value={month}
        onValueChange={(value) => setFilter('month', value)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Все месяцы" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все месяцы</SelectItem>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleResetFilters} className="h-10 bg-[var(--primary)]">
        Сбросить фильтры
      </Button>
    </div>
  );
};
