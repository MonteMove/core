/*
  Warnings:

  - You are about to drop the column `application_id` on the `operations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[applicationId]` on the table `operations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."operations" DROP CONSTRAINT "operations_application_id_fkey";

-- AlterTable
ALTER TABLE "public"."operations" DROP COLUMN "application_id",
ADD COLUMN     "applicationId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "operations_applicationId_key" ON "public"."operations"("applicationId");

-- AddForeignKey
ALTER TABLE "public"."operations" ADD CONSTRAINT "operations_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
