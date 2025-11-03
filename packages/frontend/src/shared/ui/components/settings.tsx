'use client';

import { useEffect } from 'react';

import { useTheme } from 'next-themes';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  useDeactivateMySession,
  useDeactivateSessions,
  useSessions,
} from '@/entities/session/model/use-session';
import {
  applyThemeVars,
  formatDateSafe,
  getCurrentSessionId,
} from '@/shared/lib/utils';
import { ColorField } from '@/shared/ui/components/color-field';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/card';
import { Form } from '@/shared/ui/shadcn/form';
import {
  DEFAULT_THEME,
  THEME_GROUPS,
  THEME_LABELS,
} from '@/shared/utils/constants/settings-theme';
import {
  SettingsFormValues,
  settingsSchema,
} from '@/shared/utils/schemas/setting-schemas';

export function Settings() {
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: DEFAULT_THEME[currentTheme],
  });

  useEffect(() => {
    const saved = Object.fromEntries(
      Object.keys(DEFAULT_THEME[currentTheme]).map((key) => [
        key,
        localStorage.getItem(`${currentTheme}-${key}-color`) ??
          DEFAULT_THEME[currentTheme][key],
      ]),
    );

    applyThemeVars(saved);
    form.reset(saved);
  }, [currentTheme, form]);

  const { data: sessionsData, isLoading } = useSessions();
  const deactivate = useDeactivateSessions();
  const deactivateMy = useDeactivateMySession();

  if (!sessionsData) return null;

  const handleDeactivateAll = () => {
    const currentSessionId = getCurrentSessionId(sessionsData.sessions);

    if (!currentSessionId) {
      console.error('Не удалось определить текущую сессию');
      return;
    }

    deactivate.mutate({ excludeSessionId: currentSessionId });
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        {Object.entries(THEME_GROUPS).map(([group, keys]) => (
          <Card key={group} className="mb-2">
            <CardHeader>
              <CardTitle>{group}</CardTitle>
            </CardHeader>
            <CardContent className="grid lg:grid-cols-4 gap-2">
              {keys.map((key) => (
                <ColorField
                  key={key}
                  name={key}
                  label={THEME_LABELS[key] ?? key}
                  value={form.watch(key as keyof SettingsFormValues)}
                  onChange={(val) => {
                    form.setValue(key as keyof SettingsFormValues, val);
                    document.documentElement.style.setProperty(`--${key}`, val);
                    localStorage.setItem(`${currentTheme}-${key}-color`, val);
                  }}
                />
              ))}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end mb-0">
          <Button
            className="w-full"
            type="button"
            onClick={() => {
              const theme = DEFAULT_THEME[currentTheme];
              applyThemeVars(theme);
              form.reset(theme);
              Object.keys(theme).forEach((key) =>
                localStorage.removeItem(`${currentTheme}-${key}-color`),
              );
            }}
          >
            Сбросить
          </Button>
        </div>

        <Card className="mt-6 mb-4">
          <CardHeader>
            <CardTitle className="text-xl">Сессии</CardTitle>
            <CardDescription>
              Здесь отображаются активные входы в систему
            </CardDescription>
          </CardHeader>
        </Card>
        <div>
          {isLoading && <p>Загрузка...</p>}

          {sessionsData?.sessions && sessionsData.sessions.length > 0 ? (
            <div>
              {' '}
              {sessionsData.sessions.map((session) => (
                <Card key={session.id} className="mt-2">
                  <CardContent className="lg:grid lg:grid-cols-2 gap-1">
                    <p className="col-span-2">
                      <span className="font-medium">Статус:</span>{' '}
                      {session.revoked ? (
                        <span className="text-red-600">Завершена</span>
                      ) : (
                        <span className="text-green-600">Активна</span>
                      )}
                    </p>
                    <p className="col-span-2">
                      <span className="font-medium block lg:inline">
                        Дата создания:
                      </span>{' '}
                      {formatDateSafe(session.createdAt)}
                    </p>
                    <p className="col-span-2">
                      <span className="font-medium block lg:inline">
                        {' '}
                        Устройство:{' '}
                      </span>
                      {session.userAgent ?? 'Неизвестно'}
                    </p>
                    <p className="content-center">
                      <span className="font-medium">IP: </span>{' '}
                      {session.ip ?? '—'}
                    </p>
                    <div className="lg:flex gap-2 lg:justify-end">
                      <Button
                        className="lg:w-[200] w-full lg:mt-0 mt-2"
                        type="button"
                        size="sm"
                        onClick={() =>
                          deactivate.mutate({ excludeSessionId: session.id })
                        }
                        disabled={deactivate.isPending}
                      >
                        {deactivate.isPending
                          ? 'Обработка...'
                          : 'Завершить другие'}
                      </Button>
                      <Button
                        className="lg:w-[200] w-full lg:mt-0 mt-2"
                        type="button"
                        size="sm"
                        onClick={() => deactivateMy.mutate(session.id)}
                        disabled={deactivateMy.isPending}
                      >
                        {deactivateMy.isPending ? 'Обработка...' : 'Завершить'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !isLoading ? (
            <p className="text-muted-foreground">Сессий нет</p>
          ) : null}

          {sessionsData?.sessions && sessionsData.sessions.length > 0 && (
            <div className="mt-2">
              <Button
                className="w-full"
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleDeactivateAll}
                disabled={deactivate.isPending}
              >
                {deactivate.isPending ? 'Обработка...' : 'Завершить все'}
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
