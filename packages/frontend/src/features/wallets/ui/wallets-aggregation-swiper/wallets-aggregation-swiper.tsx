'use client';

import { useMemo } from 'react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { A11y, Navigation, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { GetWalletsFilter } from '@/entities/wallet';
import { useWalletsAggregation } from '@/entities/wallet/model/use-wallets-aggregation';
import { Card, CardContent, Skeleton } from '@/shared';
import { formatNumber } from '@/shared/lib/utils/format-number';

interface WalletsAggregationSwiperProps {
  filters: GetWalletsFilter;
}

export function WalletsAggregationSwiper({
  filters,
}: WalletsAggregationSwiperProps) {
  const { data, isLoading, isError } = useWalletsAggregation(filters);

  const summaries = useMemo(
    () =>
      (data?.currencyGroups ?? []).map((group) => ({
        key: group.currency.id,
        totalAmount: group.totalAmount,
        walletsCount: group.walletsCount,
        currencyCode: group.currency.code,
        currencyName: group.currency.name,
      })),
    [data],
  );

  if (isError) {
    return (
      <div className="w-full">
        <Card className="w-full">
          <CardContent className="p-4 text-sm text-destructive">
            Не удалось загрузить агрегацию кошельков
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
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="w-full">
        <Card className="w-full">
          <CardContent className="p-4 text-sm text-muted-foreground">
            Нет кошельков по выбранным фильтрам
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-7xl mx-auto px-4 py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        {summaries.length > 4 ? (
          <button className="prev-wallets max-lg:hidden w-8 h-8 border-2 cursor-pointer hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors">
            ←
          </button>
        ) : (
          <button className="prev-wallets max-lg:hidden min-xl:hidden w-8 h-8 border-2 cursor-pointer hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors">
            ←
          </button>
        )}

        <div className="w-full overflow-hidden">
          <Swiper
            modules={[Navigation, Scrollbar, A11y]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              nextEl: '.next-wallets',
              prevEl: '.prev-wallets',
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
                      {formatNumber(summary.totalAmount)}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground uppercase">
                      {summary.currencyCode}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Кошельков: {summary.walletsCount}
                    </p>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {summaries.length > 4 ? (
          <button className="next-wallets max-lg:hidden w-8 h-8 border-2 cursor-pointer hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors">
            →
          </button>
        ) : (
          <button className="next-wallets max-lg:hidden min-xl:hidden w-8 h-8 border-2 cursor-pointer hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors">
            →
          </button>
        )}
      </div>
    </div>
  );
}
