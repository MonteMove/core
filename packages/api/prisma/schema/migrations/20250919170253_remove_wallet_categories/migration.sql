/*
  Warnings:

  - You are about to drop the column `category_id` on the `wallet_details` table. All the data in the column will be lost.
  - You are about to drop the `wallet_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."wallet_categories" DROP CONSTRAINT "wallet_categories_updated_by_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wallet_categories" DROP CONSTRAINT "wallet_categories_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wallet_details" DROP CONSTRAINT "wallet_details_category_id_fkey";

-- DropIndex
DROP INDEX "public"."wallet_details_category_idx";

-- AlterTable
ALTER TABLE "public"."wallet_details" DROP COLUMN "category_id";

-- DropTable
DROP TABLE "public"."wallet_categories";
