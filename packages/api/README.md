# @montemove/api

Backend API на NestJS с Clean Architecture.

## Разработка

```bash
# Из корня монорепо
pnpm dev:api

# Или напрямую
cd packages/api
pnpm start:dev
```

API на [http://localhost:3000](http://localhost:3000)

## База данных

```bash
# Из корня монорепо
pnpm db:generate    # Генерация Prisma Client
pnpm db:migrate     # Миграции (dev)
pnpm db:deploy      # Миграции (prod)
```

## Команды

```bash
pnpm start:dev      # Dev режим
pnpm start:debug    # С отладкой
pnpm build          # Сборка
pnpm start:prod     # Продакшн
pnpm lint           # Линтинг
pnpm test           # Тесты
pnpm test:e2e       # E2E тесты
```

## Архитектура

```
src/
├── Domain/          # Сущности и доменные ошибки
├── Application/     # UseCases и интерфейсы
├── Infrastructure/  # Реализация репозиториев и сервисов
└── Web/             # Controllers, DTOs, Filters
```

## Стек

NestJS 11, PostgreSQL, Prisma ORM, JWT, bcrypt, Clean Architecture
