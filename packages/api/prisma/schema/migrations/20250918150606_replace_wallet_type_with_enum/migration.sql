/*
  Warnings:

  - You are about to drop the column `wallet_type_id` on the `wallet_details` table. All the data in the column will be lost.
  - You are about to drop the `wallet_types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `wallet_type` to the `wallets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."wallet_type" AS ENUM ('inskech', 'bet11', 'vnj');

-- DropForeignKey
ALTER TABLE "public"."wallet_details" DROP CONSTRAINT "wallet_details_wallet_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wallet_types" DROP CONSTRAINT "wallet_types_updated_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wallet_types" DROP CONSTRAINT "wallet_types_user_id_fkey";

-- DropIndex
DROP INDEX "public"."wallet_details_type_platform_idx";

-- DropIndex
DROP INDEX "public"."wallet_details_wallet_type_idx";

-- AlterTable
ALTER TABLE "public"."wallet_details" DROP COLUMN "wallet_type_id";

-- AlterTable
ALTER TABLE "public"."wallets" ADD COLUMN     "wallet_type" "public"."wallet_type" NOT NULL;

-- DropTable
DROP TABLE "public"."wallet_types";

-- CreateIndex
CREATE INDEX "wallets_wallet_type_idx" ON "public"."wallets"("wallet_type");
