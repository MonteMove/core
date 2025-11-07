-- AlterTable
ALTER TABLE "currencies" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "network_types" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "networks" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "operation_types" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "currencies_active_idx" ON "currencies"("active");

-- CreateIndex
CREATE INDEX "network_types_active_idx" ON "network_types"("active");

-- CreateIndex
CREATE INDEX "networks_active_idx" ON "networks"("active");

-- CreateIndex
CREATE INDEX "operation_types_active_idx" ON "operation_types"("active");
