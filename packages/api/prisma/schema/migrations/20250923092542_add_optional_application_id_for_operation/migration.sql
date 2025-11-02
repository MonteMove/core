-- DropForeignKey
ALTER TABLE "public"."applications" DROP CONSTRAINT "applications_operation_id_fkey";

-- AlterTable
ALTER TABLE "public"."operations" ADD COLUMN     "application_id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."operations" ADD CONSTRAINT "operations_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
