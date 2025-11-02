/*
  Warnings:

  - You are about to drop the column `platform_id` on the `wallet_details` table. All the data in the column will be lost.
  - You are about to drop the `platforms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."platforms" DROP CONSTRAINT "platforms_updated_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."platforms" DROP CONSTRAINT "platforms_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wallet_details" DROP CONSTRAINT "wallet_details_platform_id_fkey";

-- DropIndex
DROP INDEX "public"."wallet_details_platform_idx";

-- AlterTable
ALTER TABLE "public"."wallet_details" DROP COLUMN "platform_id";

-- DropTable
DROP TABLE "public"."platforms";
