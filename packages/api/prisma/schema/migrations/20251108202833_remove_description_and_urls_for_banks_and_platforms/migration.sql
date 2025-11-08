/*
  Warnings:

  - You are about to drop the column `description` on the `banks` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `banks` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `banks` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `platforms` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `platforms` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `platforms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "banks" DROP COLUMN "description",
DROP COLUMN "icon",
DROP COLUMN "url";

-- AlterTable
ALTER TABLE "platforms" DROP COLUMN "description",
DROP COLUMN "icon",
DROP COLUMN "url";
