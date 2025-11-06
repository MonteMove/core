'use client';

import React, { Fragment, useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { BookOpen, Copy, Pencil, Trash } from 'lucide-react';

import { GetGuidesParamsRequest } from '@/entities/guides/model/guide-schemas';
import {
  useCopyGuide,
  useDeleteGuide,
} from '@/features/guides/hooks/use-guide';
import { useInfiniteGuides } from '@/features/guides/hooks/use-guide';
import { copyHandler, formatDate, formatDateTime } from '@/shared/lib/utils';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  ROUTER_MAP,
  Skeleton,
} from '@/shared';

export function GuidesList({ filters }: { filters?: GetGuidesParamsRequest }) {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteGuides(filters);

  const lastGuideRef = useRef<HTMLDivElement | null>(null);
  const { copyGuide } = useCopyGuide();
  const router = useRouter();
  const { mutate: deleteGuide } = useDeleteGuide(filters);

  useEffect(() => {
    if (!hasNextPage || isFetching) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    const node = lastGuideRef.current;
    if (node) observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className={'flex flex-col gap-2'}>
      <div className="m-0 p-0 mt-4">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {new Array(5).fill(null).map((_, i) => (
              <Card key={i} className="h-[176] w-full p-0">
                <Skeleton className="h-[176] w-full"></Skeleton>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="justify-items-center">
            <Card className="h-[100] w-full p-0 justify-center items-center text-lg">
              <p className="text-destructive">
                Ошибка при загрузке: {error.message}
              </p>
            </Card>
          </div>
        ) : !data?.pages[0]?.guides.length ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BookOpen />
              </EmptyMedia>
              <EmptyContent>
                <EmptyTitle>Справочники не найдены</EmptyTitle>
                <EmptyDescription>
                  Нет справочников, соответствующих выбранным критериям.
                  Создайте новый справочник.
                </EmptyDescription>
              </EmptyContent>
            </EmptyHeader>
          </Empty>
        ) : (
          <div>
            {data?.pages.map((page, pageIndex) => (
              <Fragment key={pageIndex}>
                {page.guides.map((guide, guideIndex) => {
                  const isLast =
                    pageIndex === data.pages.length - 1 &&
                    guideIndex === page.guides.length - 1;

                  return (
                    <DropdownMenu key={guide.id}>
                      <DropdownMenuTrigger asChild>
                        <Card
                          ref={isLast ? lastGuideRef : null}
                          className="relative gap-2 mb-2 cursor-pointer text-foreground"
                          onTouchStart={(e) => {
                            const timer = setTimeout(() => {
                              e.currentTarget.click();
                            }, 600);
                            const cancel = () => clearTimeout(timer);
                            e.currentTarget.addEventListener(
                              'touchend',
                              cancel,
                              { once: true },
                            );
                            e.currentTarget.addEventListener(
                              'touchmove',
                              cancel,
                              { once: true },
                            );
                          }}
                        >
                          <CardHeader className="lg:grid lg:grid-cols-3 flex flex-col">
                            <p className="col-span-2">
                              <span>
                                <strong>ФИО: </strong>
                                <span className="block lg:inline">
                                  {guide.fullName || 'Не указано'}
                                </span>
                              </span>
                            </p>
                            <p className="flex justify-end">
                              <span>
                                <strong>Создан: </strong>
                                <span className="block lg:inline">
                                  {formatDateTime(guide.createdAt)}
                                </span>
                              </span>
                            </p>
                          </CardHeader>

                          <CardContent className="flex flex-col">
                            <p>
                              <strong className="mr-1">Телефон:</strong>
                              <span
                                className="block lg:inline text-primary cursor-pointer"
                                onPointerDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (guide.phone) copyHandler(guide.phone);
                                }}
                              >
                                {guide.phone || 'Не указано'}
                              </span>
                            </p>
                            <p>
                              <strong className="mr-1">Дата рождения:</strong>
                              <span className="block lg:inline">
                                {guide.birthDate
                                  ? formatDate(new Date(guide.birthDate))
                                  : 'Не указано'}
                              </span>
                            </p>
                            <p>
                              <strong className="mr-1">Номер карты:</strong>
                              <span
                                className="block lg:inline text-primary cursor-pointer"
                                onPointerDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (guide.cardNumber)
                                    copyHandler(guide.cardNumber);
                                }}
                              >
                                {guide.cardNumber || 'Не указано'}
                              </span>
                            </p>
                            <p>
                              <strong className="mr-1">Адрес:</strong>
                              <span className="block lg:inline">
                                {guide.address || 'Не указано'}
                              </span>
                            </p>
                          </CardContent>

                          <CardFooter className="flex justify-between items-start gap-2">
                            <p className="flex-1">
                              <strong className="mr-1">Описание:</strong>
                              <span className="block lg:inline">
                                {guide.description || 'Не указано'}
                              </span>
                            </p>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="shrink-0"
                              onPointerDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                copyGuide(guide);
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="center"
                        className="w-40 bg-background shadow-md rounded-md text-foreground"
                      >
                        <DropdownMenuItem
                          className="hover:bg-primary/60 dark:hover:bg-primary/60"
                          onClick={() =>
                            router.push(ROUTER_MAP.GUIDES_EDIT + '/' + guide.id)
                          }
                        >
                          <Pencil className="mr-2 h-4 w-4 text-primary" />{' '}
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive/60 hover:text-destructive! hover:bg-destructive dark:hover:bg-destructive"
                          onClick={() => deleteGuide(guide.id)}
                        >
                          <Trash className="mr-2 h-4 w-4 text-destructive/60" />{' '}
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                })}
              </Fragment>
            ))}
          </div>
        )}
      </div>

      {isFetching && hasNextPage && (
        <p className="text-center py-4">Загрузка...</p>
      )}
    </div>
  );
}
