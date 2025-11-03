-- CreateEnum
CREATE TYPE "role_code" AS ENUM ('admin', 'moderator', 'user');

-- CreateEnum
CREATE TYPE "operation_direction" AS ENUM ('credit', 'debit');

-- CreateEnum
CREATE TYPE "application_status" AS ENUM ('open', 'done');

-- CreateEnum
CREATE TYPE "balance_status" AS ENUM ('unknown', 'positive', 'negative', 'neutral');

-- CreateEnum
CREATE TYPE "wallet_kind" AS ENUM ('crypto', 'bank', 'simple');

-- CreateTable
CREATE TABLE "revoked_tokens" (
    "id" UUID NOT NULL,
    "jti" TEXT NOT NULL,
    "revoked_by_id" UUID NOT NULL,
    "token_user_id" UUID NOT NULL,
    "token_expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revoked_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "code" "role_code" NOT NULL,
    "name" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "ip" TEXT,
    "user_agent" TEXT,
    "jti" TEXT NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "telegram_id" TEXT,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "telegram_notifications" BOOLEAN NOT NULL DEFAULT false,
    "is_holder" BOOLEAN NOT NULL DEFAULT false,
    "is_courier" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "network_types" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "network_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "network_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "networks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "networks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operation_entries" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "operation_id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "direction" "operation_direction" NOT NULL,
    "amount" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operation_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operation_types" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operation_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "type_id" UUID NOT NULL,
    "description" TEXT,
    "conversion_group_id" INTEGER,
    "applicationId" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parser_data" (
    "id" UUID NOT NULL,
    "usd_eur" DECIMAL(18,6),
    "usdt_rub" DECIMAL(18,6),
    "serbia_mults_rsd_coef" DECIMAL(18,6),
    "serbia_mults_eur_usdt_coef" DECIMAL(18,6),
    "additional_serbia_eur_usdt" DECIMAL(18,6),
    "additional_serbia_eur_rub" DECIMAL(18,6),
    "additional_serbia_rsd_usdt" DECIMAL(18,6),
    "additional_serbia_rsd_rub" DECIMAL(18,6),
    "montenegro_eur_usdt" DECIMAL(18,6),
    "montenegro_mults_eur_usdt_coef" DECIMAL(18,6),
    "additional_montenegro_rsd_usdt" DECIMAL(18,6),
    "additional_montenegro_rsd_rub" DECIMAL(18,6),
    "tinkoff_course" DECIMAL(18,6),
    "usdt_tjs" DECIMAL(18,6),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parser_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,
    "operation_type_id" UUID NOT NULL,
    "assignee_user_id" UUID NOT NULL,
    "operation_id" UUID,
    "status" "application_status" NOT NULL,
    "description" TEXT,
    "amount" INTEGER NOT NULL,
    "telegram_username" TEXT,
    "phone" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "meeting_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guides" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "description" TEXT,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "card_number" TEXT,
    "birth_date" TEXT,
    "address" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_details" (
    "id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "phone" TEXT,
    "card" TEXT,
    "owner_full_name" TEXT,
    "network_id" UUID,
    "network_type_id" UUID,
    "address" TEXT,
    "account_id" TEXT,
    "username" TEXT,
    "exchange_uid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_types" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "show_in_tabs" BOOLEAN NOT NULL DEFAULT false,
    "tab_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" INTEGER NOT NULL,
    "balance_status" "balance_status" NOT NULL,
    "wallet_kind" "wallet_kind" NOT NULL DEFAULT 'simple',
    "wallet_type_id" UUID,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "pin_on_main" BOOLEAN NOT NULL DEFAULT false,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_RoleToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OperationToWallet" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_OperationToWallet_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "revoked_tokens_revoked_by_idx" ON "revoked_tokens"("revoked_by_id");

-- CreateIndex
CREATE INDEX "revoked_tokens_token_user_idx" ON "revoked_tokens"("token_user_id");

-- CreateIndex
CREATE INDEX "revoked_tokens_token_expires_at_idx" ON "revoked_tokens"("token_expires_at");

-- CreateIndex
CREATE INDEX "revoked_tokens_revoked_at_idx" ON "revoked_tokens"("revoked_at");

-- CreateIndex
CREATE INDEX "revoked_tokens_user_revoked_idx" ON "revoked_tokens"("token_user_id", "revoked_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "revoked_tokens_jti_unique" ON "revoked_tokens"("jti");

-- CreateIndex
CREATE INDEX "roles_created_at_idx" ON "roles"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_unique" ON "roles"("code");

-- CreateIndex
CREATE INDEX "sessions_user_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_jti_idx" ON "sessions"("jti");

-- CreateIndex
CREATE INDEX "sessions_revoked_idx" ON "sessions"("revoked");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_jti_key" ON "sessions"("jti");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_telegram_id_idx" ON "users"("telegram_id");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "users_last_login_idx" ON "users"("last_login");

-- CreateIndex
CREATE INDEX "users_deleted_created_idx" ON "users"("deleted", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_unique" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_unique" ON "users"("telegram_id");

-- CreateIndex
CREATE INDEX "network_types_user_idx" ON "network_types"("user_id");

-- CreateIndex
CREATE INDEX "network_types_updated_by_idx" ON "network_types"("updated_by_id");

-- CreateIndex
CREATE INDEX "network_types_network_idx" ON "network_types"("network_id");

-- CreateIndex
CREATE INDEX "network_types_code_idx" ON "network_types"("code");

-- CreateIndex
CREATE INDEX "network_types_deleted_idx" ON "network_types"("deleted");

-- CreateIndex
CREATE UNIQUE INDEX "network_types_network_code_deleted_unique" ON "network_types"("network_id", "code", "deleted");

-- CreateIndex
CREATE INDEX "networks_user_idx" ON "networks"("user_id");

-- CreateIndex
CREATE INDEX "networks_updated_by_idx" ON "networks"("updated_by_id");

-- CreateIndex
CREATE INDEX "networks_code_idx" ON "networks"("code");

-- CreateIndex
CREATE INDEX "networks_deleted_idx" ON "networks"("deleted");

-- CreateIndex
CREATE UNIQUE INDEX "networks_code_deleted_unique" ON "networks"("code", "deleted");

-- CreateIndex
CREATE INDEX "operation_entries_user_idx" ON "operation_entries"("user_id");

-- CreateIndex
CREATE INDEX "operation_entries_updated_by_idx" ON "operation_entries"("updated_by_id");

-- CreateIndex
CREATE INDEX "operation_entries_operation_idx" ON "operation_entries"("operation_id");

-- CreateIndex
CREATE INDEX "operation_entries_wallet_idx" ON "operation_entries"("wallet_id");

-- CreateIndex
CREATE INDEX "operation_entries_direction_idx" ON "operation_entries"("direction");

-- CreateIndex
CREATE INDEX "operation_entries_created_at_idx" ON "operation_entries"("created_at");

-- CreateIndex
CREATE INDEX "operation_entries_deleted_idx" ON "operation_entries"("deleted");

-- CreateIndex
CREATE INDEX "operation_types_user_id_idx" ON "operation_types"("user_id");

-- CreateIndex
CREATE INDEX "operation_types_updated_by_id_idx" ON "operation_types"("updated_by_id");

-- CreateIndex
CREATE INDEX "operation_types_name_idx" ON "operation_types"("name");

-- CreateIndex
CREATE INDEX "operation_types_created_at_idx" ON "operation_types"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "operations_applicationId_key" ON "operations"("applicationId");

-- CreateIndex
CREATE INDEX "operations_user_idx" ON "operations"("user_id");

-- CreateIndex
CREATE INDEX "operations_updated_by_idx" ON "operations"("updated_by_id");

-- CreateIndex
CREATE INDEX "operations_type_idx" ON "operations"("type_id");

-- CreateIndex
CREATE INDEX "operations_conversion_group_idx" ON "operations"("conversion_group_id");

-- CreateIndex
CREATE INDEX "operations_deleted_idx" ON "operations"("deleted");

-- CreateIndex
CREATE INDEX "operations_created_at_idx" ON "operations"("created_at");

-- CreateIndex
CREATE INDEX "parser_data_created_at_idx" ON "parser_data"("created_at");

-- CreateIndex
CREATE INDEX "parser_data_updated_at_idx" ON "parser_data"("updated_at");

-- CreateIndex
CREATE INDEX "applications_user_id_idx" ON "applications"("user_id");

-- CreateIndex
CREATE INDEX "applications_updated_by_id_idx" ON "applications"("updated_by_id");

-- CreateIndex
CREATE INDEX "applications_assignee_user_id_idx" ON "applications"("assignee_user_id");

-- CreateIndex
CREATE INDEX "applications_currency_id_idx" ON "applications"("currency_id");

-- CreateIndex
CREATE INDEX "applications_operation_type_id_idx" ON "applications"("operation_type_id");

-- CreateIndex
CREATE INDEX "applications_operation_id_idx" ON "applications"("operation_id");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE INDEX "applications_deleted_idx" ON "applications"("deleted");

-- CreateIndex
CREATE INDEX "applications_meeting_date_idx" ON "applications"("meeting_date");

-- CreateIndex
CREATE INDEX "applications_created_at_idx" ON "applications"("created_at");

-- CreateIndex
CREATE INDEX "applications_updated_at_idx" ON "applications"("updated_at");

-- CreateIndex
CREATE INDEX "applications_amount_idx" ON "applications"("amount");

-- CreateIndex
CREATE INDEX "applications_telegram_username_idx" ON "applications"("telegram_username");

-- CreateIndex
CREATE INDEX "applications_phone_idx" ON "applications"("phone");

-- CreateIndex
CREATE INDEX "applications_deleted_created_idx" ON "applications"("deleted", "created_at" DESC);

-- CreateIndex
CREATE INDEX "applications_assignee_status_deleted_idx" ON "applications"("assignee_user_id", "status", "deleted");

-- CreateIndex
CREATE INDEX "applications_status_deleted_idx" ON "applications"("status", "deleted");

-- CreateIndex
CREATE INDEX "currencies_user_id_idx" ON "currencies"("user_id");

-- CreateIndex
CREATE INDEX "currencies_updated_by_id_idx" ON "currencies"("updated_by_id");

-- CreateIndex
CREATE INDEX "currencies_created_at_idx" ON "currencies"("created_at");

-- CreateIndex
CREATE INDEX "currencies_updated_at_idx" ON "currencies"("updated_at");

-- CreateIndex
CREATE INDEX "currencies_deleted_created_idx" ON "currencies"("deleted", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_deleted_unique" ON "currencies"("code", "deleted");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_name_deleted_unique" ON "currencies"("name", "deleted");

-- CreateIndex
CREATE INDEX "guides_user_idx" ON "guides"("user_id");

-- CreateIndex
CREATE INDEX "guides_updated_by_idx" ON "guides"("updated_by_id");

-- CreateIndex
CREATE INDEX "guides_phone_idx" ON "guides"("phone");

-- CreateIndex
CREATE INDEX "guides_address_idx" ON "guides"("address");

-- CreateIndex
CREATE INDEX "guides_deleted_created_idx" ON "guides"("deleted", "created_at" DESC);

-- CreateIndex
CREATE INDEX "wallet_details_user_idx" ON "wallet_details"("user_id");

-- CreateIndex
CREATE INDEX "wallet_details_updated_by_idx" ON "wallet_details"("updated_by_id");

-- CreateIndex
CREATE INDEX "wallet_details_wallet_idx" ON "wallet_details"("wallet_id");

-- CreateIndex
CREATE INDEX "wallet_details_network_idx" ON "wallet_details"("network_id");

-- CreateIndex
CREATE INDEX "wallet_details_network_type_idx" ON "wallet_details"("network_type_id");

-- CreateIndex
CREATE INDEX "wallet_details_phone_idx" ON "wallet_details"("phone");

-- CreateIndex
CREATE INDEX "wallet_details_address_idx" ON "wallet_details"("address");

-- CreateIndex
CREATE INDEX "wallet_details_account_id_idx" ON "wallet_details"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_details_wallet_unique" ON "wallet_details"("wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_types_code_key" ON "wallet_types"("code");

-- CreateIndex
CREATE INDEX "wallet_types_code_idx" ON "wallet_types"("code");

-- CreateIndex
CREATE INDEX "wallet_types_show_in_tabs_idx" ON "wallet_types"("show_in_tabs");

-- CreateIndex
CREATE INDEX "wallet_types_active_idx" ON "wallet_types"("active");

-- CreateIndex
CREATE INDEX "wallet_types_deleted_idx" ON "wallet_types"("deleted");

-- CreateIndex
CREATE INDEX "wallets_user_idx" ON "wallets"("user_id");

-- CreateIndex
CREATE INDEX "wallets_updated_by_idx" ON "wallets"("updated_by_id");

-- CreateIndex
CREATE INDEX "wallets_currency_idx" ON "wallets"("currency_id");

-- CreateIndex
CREATE INDEX "wallets_wallet_kind_idx" ON "wallets"("wallet_kind");

-- CreateIndex
CREATE INDEX "wallets_wallet_type_idx" ON "wallets"("wallet_type_id");

-- CreateIndex
CREATE INDEX "wallets_active_idx" ON "wallets"("active");

-- CreateIndex
CREATE INDEX "wallet_settings_pin_on_main_idx" ON "wallets"("pin_on_main");

-- CreateIndex
CREATE INDEX "wallet_settings_pinned_idx" ON "wallets"("pinned");

-- CreateIndex
CREATE INDEX "wallet_settings_visible_idx" ON "wallets"("visible");

-- CreateIndex
CREATE INDEX "wallets_deleted_idx" ON "wallets"("deleted");

-- CreateIndex
CREATE INDEX "wallets_created_at_idx" ON "wallets"("created_at");

-- CreateIndex
CREATE INDEX "wallets_updated_at_idx" ON "wallets"("updated_at");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "_RoleToUser"("B");

-- CreateIndex
CREATE INDEX "_OperationToWallet_B_index" ON "_OperationToWallet"("B");

-- AddForeignKey
ALTER TABLE "revoked_tokens" ADD CONSTRAINT "revoked_tokens_revoked_by_id_fkey" FOREIGN KEY ("revoked_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revoked_tokens" ADD CONSTRAINT "revoked_tokens_token_user_id_fkey" FOREIGN KEY ("token_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_types" ADD CONSTRAINT "network_types_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_types" ADD CONSTRAINT "network_types_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_types" ADD CONSTRAINT "network_types_network_id_fkey" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "networks" ADD CONSTRAINT "networks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "networks" ADD CONSTRAINT "networks_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_entries" ADD CONSTRAINT "operation_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_entries" ADD CONSTRAINT "operation_entries_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_entries" ADD CONSTRAINT "operation_entries_operation_id_fkey" FOREIGN KEY ("operation_id") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_types" ADD CONSTRAINT "operation_types_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operation_types" ADD CONSTRAINT "operation_types_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "operation_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_assignee_user_id_fkey" FOREIGN KEY ("assignee_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_operation_type_id_fkey" FOREIGN KEY ("operation_type_id") REFERENCES "operation_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "currencies" ADD CONSTRAINT "currencies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "currencies" ADD CONSTRAINT "currencies_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guides" ADD CONSTRAINT "guides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guides" ADD CONSTRAINT "guides_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_details" ADD CONSTRAINT "wallet_details_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_details" ADD CONSTRAINT "wallet_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_details" ADD CONSTRAINT "wallet_details_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_details" ADD CONSTRAINT "wallet_details_network_id_fkey" FOREIGN KEY ("network_id") REFERENCES "networks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_details" ADD CONSTRAINT "wallet_details_network_type_id_fkey" FOREIGN KEY ("network_type_id") REFERENCES "network_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_created_by_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_updated_by_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_wallet_type_id_fkey" FOREIGN KEY ("wallet_type_id") REFERENCES "wallet_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OperationToWallet" ADD CONSTRAINT "_OperationToWallet_A_fkey" FOREIGN KEY ("A") REFERENCES "operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OperationToWallet" ADD CONSTRAINT "_OperationToWallet_B_fkey" FOREIGN KEY ("B") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
