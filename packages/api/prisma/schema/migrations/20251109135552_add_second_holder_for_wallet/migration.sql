-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "second_user_id" UUID;

-- CreateIndex
CREATE INDEX "wallets_second_user_idx" ON "wallets"("second_user_id");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_second_user_id_fkey" FOREIGN KEY ("second_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
