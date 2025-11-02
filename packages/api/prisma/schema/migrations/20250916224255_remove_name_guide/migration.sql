/*
  Warnings:

  - You are about to drop the column `name` on the `guides` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."guides_user_name_unique";

-- AlterTable
ALTER TABLE "public"."guides" DROP COLUMN "name";
