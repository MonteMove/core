-- AddForeignKey
ALTER TABLE "operation_entries" ADD CONSTRAINT "operation_entries_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
