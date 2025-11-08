-- AlterTable
ALTER TABLE "wallet_details" ADD COLUMN     "bank_id" UUID;

-- CreateTable
CREATE TABLE "banks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banks_code_key" ON "banks"("code");

-- CreateIndex
CREATE INDEX "banks_user_idx" ON "banks"("user_id");

-- CreateIndex
CREATE INDEX "banks_updated_by_idx" ON "banks"("updated_by_id");

-- CreateIndex
CREATE INDEX "banks_code_idx" ON "banks"("code");

-- CreateIndex
CREATE INDEX "banks_active_idx" ON "banks"("active");

-- CreateIndex
CREATE INDEX "banks_deleted_idx" ON "banks"("deleted");

-- CreateIndex
CREATE INDEX "banks_created_at_idx" ON "banks"("created_at");

-- CreateIndex
CREATE INDEX "wallet_details_bank_idx" ON "wallet_details"("bank_id");

-- AddForeignKey
ALTER TABLE "banks" ADD CONSTRAINT "banks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banks" ADD CONSTRAINT "banks_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_details" ADD CONSTRAINT "wallet_details_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
