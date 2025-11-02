/*
  Warnings:

  - Made the column `name` on table `wallets` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."wallet_kind" AS ENUM ('crypto', 'bank', 'simple');

-- AlterTable
ALTER TABLE "public"."wallets" ADD COLUMN     "wallet_kind" "public"."wallet_kind" NOT NULL DEFAULT 'simple',
ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE INDEX "wallets_wallet_kind_idx" ON "public"."wallets"("wallet_kind");
