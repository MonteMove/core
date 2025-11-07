-- AlterTable
ALTER TABLE "wallet_details" ADD COLUMN     "platform_id" UUID;

-- CreateTable
CREATE TABLE "platforms" (
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

    CONSTRAINT "platforms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platforms_code_key" ON "platforms"("code");

-- CreateIndex
CREATE INDEX "platforms_user_idx" ON "platforms"("user_id");

-- CreateIndex
CREATE INDEX "platforms_updated_by_idx" ON "platforms"("updated_by_id");

-- CreateIndex
CREATE INDEX "platforms_code_idx" ON "platforms"("code");

-- CreateIndex
CREATE INDEX "platforms_active_idx" ON "platforms"("active");

-- CreateIndex
CREATE INDEX "platforms_deleted_idx" ON "platforms"("deleted");

-- CreateIndex
CREATE INDEX "platforms_created_at_idx" ON "platforms"("created_at");

-- CreateIndex
CREATE INDEX "wallet_details_platform_idx" ON "wallet_details"("platform_id");

-- AddForeignKey
ALTER TABLE "platforms" ADD CONSTRAINT "platforms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platforms" ADD CONSTRAINT "platforms_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_details" ADD CONSTRAINT "wallet_details_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
