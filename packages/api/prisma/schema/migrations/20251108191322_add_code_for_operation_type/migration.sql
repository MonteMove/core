/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `operation_types` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `operation_types` table without a default value. This is not possible if the table is not empty.

*/
-- Шаг 1: Добавляем колонку code как nullable
ALTER TABLE "operation_types" ADD COLUMN "code" TEXT;

-- Шаг 2: Заполняем code для существующих записей
UPDATE "operation_types" SET "code" = 'avans' WHERE "name" = 'Аванс';
UPDATE "operation_types" SET "code" = 'correction' WHERE "name" = 'Корректировка';

-- Шаг 3: Делаем колонку обязательной
ALTER TABLE "operation_types" ALTER COLUMN "code" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "operation_types_code_key" ON "operation_types"("code");

-- CreateIndex
CREATE INDEX "operation_types_code_idx" ON "operation_types"("code");
