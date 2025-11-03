'use client';

import { useMemo } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { A11y, Navigation, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { WalletCurrencyGroup } from '@/entities/wallet';
import { Card, CardContent } from '@/shared';
import { Skeleton } from '@/shared';

interface DashboardCurrencyProps {
  isLoading: boolean;
  hasError: boolean;
  currencyGroups: WalletCurrencyGroup[];
}

const getWalletsLabel = (count: number) => {
  const mod100 = count % 100;
  const mod10 = count % 10;

  if (mod100 >= 11 && mod100 <= 14) return 'кошельков';
  if (mod10 === 1) return 'кошелек';
  if (mod10 >= 2 && mod10 <= 4) return 'кошелька';
  return 'кошельков';
};

export function DashboardCurrency({
  isLoading,
  hasError,
  currencyGroups,
}: DashboardCurrencyProps) {
  const summaries = useMemo(
    () =>
      currencyGroups.map((group) => {
        const totalAmount = group.wallets.reduce(
          (acc, wallet) => acc + wallet.amount,
          0,
        );
        const walletsCount = group.wallets.length;
        const firstWallet = group.wallets[0];
        const currencyCode =
          firstWallet?.currency.code ?? group.currency.toUpperCase();
        const currencyName = firstWallet?.currency.name ?? currencyCode;

        return {
          key: group.currency,
          totalAmount,
          walletsCount,
          currencyCode,
          currencyName,
        };
      }),
    [currencyGroups],
  );

  if (hasError) {
    return (
      <div className="w-full">
        <Card className="w-full">
          <CardContent className="p-4 text-sm text-destructive">
            Не удалось загрузить данные о кошельках
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid w-full gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="w-full">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="mt-2 h-4 w-16" />
              <Skeleton className="mt-2 h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (currencyGroups.length === 0) {
    return (
      <div className="w-full">
        <Card className="w-full">
          <CardContent className="p-4 text-sm text-muted-foreground">
            Нет закрепленных кошельков
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        {summaries.length > 4 ? (
          <button className="prev max-lg:hidden w-8 h-8 border-2 cursor-pointer hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors">
            ←
          </button>
        ) : (
          <button className="prev max-lg:hidden  min-xl:hidden w-8 h-8 border-2 cursor-pointer hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors">
            ←
          </button>
        )}

        <div className="w-full overflow-hidden">
          <Swiper
            modules={[Navigation, Scrollbar, A11y]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: '.next',
              prevEl: '.prev',
            }}
            scrollbar={{ draggable: true }}
            breakpoints={{
              600: { slidesPerView: 1 },
              620: {
                slidesPerView: summaries.length > 2 ? 2 : summaries.length,
              },
              800: {
                slidesPerView: summaries.length > 3 ? 3 : summaries.length,
              },
              1280: {
                slidesPerView: summaries.length > 4 ? 4 : summaries.length,
              },
            }}
            className="w-full"
          >
            {summaries.map((summary) => (
              <SwiperSlide key={summary.key} className="h-auto">
                <Card className="w-full h-fit p-0">
                  <CardContent className="flex flex-col p-4 gap-1">
                    <p className="text-2xl font-semibold">
                      {summary.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground uppercase">
                      {summary.currencyCode}
                    </p>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {summaries.length > 4 ? (
          <button className="next max-lg:hidden w-8 h-8 border-2 cursor-pointer hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors">
            ←
          </button>
        ) : (
          <button className="next max-lg:hidden  min-xl:hidden w-8 h-8 border-2 cursor-pointer hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors">
            →
          </button>
        )}
      </div>
    </div>
  );
}
