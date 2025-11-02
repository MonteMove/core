-- CreateEnum
CREATE TYPE "public"."application_status" AS ENUM ('open', 'done');

-- CreateEnum
CREATE TYPE "public"."operation_direction" AS ENUM ('credit', 'debit');

-- CreateEnum
CREATE TYPE "public"."role_code" AS ENUM ('admin', 'moderator', 'holder', 'courier', 'user');

-- CreateEnum
CREATE TYPE "public"."balance_status" AS ENUM ('unknown', 'positive', 'negative', 'neutral');

-- CreateTable
CREATE TABLE "public"."applications" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,
    "operation_type_id" UUID NOT NULL,
    "assignee_user_id" UUID NOT NULL,
    "operation_id" UUID,
    "status" "public"."application_status" NOT NULL,
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
CREATE TABLE "public"."currencies" (
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
CREATE TABLE "public"."guides" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "full_name" TEXT,
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
CREATE TABLE "public"."network_types" (
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
CREATE TABLE "public"."networks" (
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
CREATE TABLE "public"."operation_entries" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "operation_id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "direction" "public"."operation_direction" NOT NULL,
    "amount" INTEGER NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operation_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."operation_types" (
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
CREATE TABLE "public"."operations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "type_id" UUID NOT NULL,
    "description" TEXT,
    "conversion_group_id" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."parser_data" (
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
CREATE TABLE "public"."platforms" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."revoked_tokens" (
    "id" UUID NOT NULL,
    "jti" TEXT NOT NULL,
    "revoked_by_id" UUID NOT NULL,
    "token_user_id" UUID NOT NULL,
    "token_expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revoked_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" UUID NOT NULL,
    "code" "public"."role_code" NOT NULL,
    "name" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
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
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "telegram_id" TEXT,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "telegram_notifications" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wallet_categories" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wallet_details" (
    "id" UUID NOT NULL,
    "wallet_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "wallet_type_id" UUID NOT NULL,
    "platform_id" UUID,
    "category_id" UUID,
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
CREATE TABLE "public"."wallet_types" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wallets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "updated_by_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "amount" INTEGER NOT NULL,
    "balance_status" "public"."balance_status" NOT NULL,
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
CREATE TABLE "public"."_OperationToWallet" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_OperationToWallet_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_RoleToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_RoleToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "applications_user_id_idx" ON "public"."applications"("user_id");

-- CreateIndex
CREATE INDEX "applications_updated_by_id_idx" ON "public"."applications"("updated_by_id");

-- CreateIndex
CREATE INDEX "applications_assignee_user_id_idx" ON "public"."applications"("assignee_user_id");

-- CreateIndex
CREATE INDEX "applications_currency_id_idx" ON "public"."applications"("currency_id");

-- CreateIndex
CREATE INDEX "applications_operation_type_id_idx" ON "public"."applications"("operation_type_id");

-- CreateIndex
CREATE INDEX "applications_operation_id_idx" ON "public"."applications"("operation_id");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "public"."applications"("status");

-- CreateIndex
CREATE INDEX "applications_deleted_idx" ON "public"."applications"("deleted");

-- CreateIndex
CREATE INDEX "applications_meeting_date_idx" ON "public"."applications"("meeting_date");

-- CreateIndex
CREATE INDEX "applications_created_at_idx" ON "public"."applications"("created_at");

-- CreateIndex
CREATE INDEX "applications_updated_at_idx" ON "public"."applications"("updated_at");

-- CreateIndex
CREATE INDEX "applications_amount_idx" ON "public"."applications"("amount");

-- CreateIndex
CREATE INDEX "applications_telegram_username_idx" ON "public"."applications"("telegram_username");

-- CreateIndex
CREATE INDEX "applications_phone_idx" ON "public"."applications"("phone");

-- CreateIndex
CREATE INDEX "applications_deleted_created_idx" ON "public"."applications"("deleted", "created_at" DESC);

-- CreateIndex
CREATE INDEX "applications_assignee_status_deleted_idx" ON "public"."applications"("assignee_user_id", "status", "deleted");

-- CreateIndex
CREATE INDEX "applications_status_deleted_idx" ON "public"."applications"("status", "deleted");

-- CreateIndex
CREATE INDEX "currencies_user_id_idx" ON "public"."currencies"("user_id");

-- CreateIndex
CREATE INDEX "currencies_updated_by_id_idx" ON "public"."currencies"("updated_by_id");

-- CreateIndex
CREATE INDEX "currencies_created_at_idx" ON "public"."currencies"("created_at");

-- CreateIndex
CREATE INDEX "currencies_updated_at_idx" ON "public"."currencies"("updated_at");

-- CreateIndex
CREATE INDEX "currencies_deleted_created_idx" ON "public"."currencies"("deleted", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_unique" ON "public"."currencies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_name_unique" ON "public"."currencies"("name");

-- CreateIndex
CREATE INDEX "guides_user_idx" ON "public"."guides"("user_id");

-- CreateIndex
CREATE INDEX "guides_updated_by_idx" ON "public"."guides"("updated_by_id");

-- CreateIndex
CREATE INDEX "guides_phone_idx" ON "public"."guides"("phone");

-- CreateIndex
CREATE INDEX "guides_address_idx" ON "public"."guides"("address");

-- CreateIndex
CREATE INDEX "guides_deleted_created_idx" ON "public"."guides"("deleted", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "guides_user_name_unique" ON "public"."guides"("user_id", "name");

-- CreateIndex
CREATE INDEX "network_types_user_idx" ON "public"."network_types"("user_id");

-- CreateIndex
CREATE INDEX "network_types_updated_by_idx" ON "public"."network_types"("updated_by_id");

-- CreateIndex
CREATE INDEX "network_types_network_idx" ON "public"."network_types"("network_id");

-- CreateIndex
CREATE INDEX "network_types_code_idx" ON "public"."network_types"("code");

-- CreateIndex
CREATE INDEX "network_types_deleted_idx" ON "public"."network_types"("deleted");

-- CreateIndex
CREATE UNIQUE INDEX "network_types_network_code_unique" ON "public"."network_types"("network_id", "code");

-- CreateIndex
CREATE INDEX "networks_user_idx" ON "public"."networks"("user_id");

-- CreateIndex
CREATE INDEX "networks_updated_by_idx" ON "public"."networks"("updated_by_id");

-- CreateIndex
CREATE INDEX "networks_code_idx" ON "public"."networks"("code");

-- CreateIndex
CREATE INDEX "networks_deleted_idx" ON "public"."networks"("deleted");

-- CreateIndex
CREATE UNIQUE INDEX "networks_code_unique" ON "public"."networks"("code");

-- CreateIndex
CREATE INDEX "operation_entries_user_idx" ON "public"."operation_entries"("user_id");

-- CreateIndex
CREATE INDEX "operation_entries_updated_by_idx" ON "public"."operation_entries"("updated_by_id");

-- CreateIndex
CREATE INDEX "operation_entries_operation_idx" ON "public"."operation_entries"("operation_id");

-- CreateIndex
CREATE INDEX "operation_entries_wallet_idx" ON "public"."operation_entries"("wallet_id");

-- CreateIndex
CREATE INDEX "operation_entries_direction_idx" ON "public"."operation_entries"("direction");

-- CreateIndex
CREATE INDEX "operation_entries_created_at_idx" ON "public"."operation_entries"("created_at");

-- CreateIndex
CREATE INDEX "operation_entries_deleted_idx" ON "public"."operation_entries"("deleted");

-- CreateIndex
CREATE INDEX "operation_types_user_id_idx" ON "public"."operation_types"("user_id");

-- CreateIndex
CREATE INDEX "operation_types_updated_by_id_idx" ON "public"."operation_types"("updated_by_id");

-- CreateIndex
CREATE INDEX "operation_types_name_idx" ON "public"."operation_types"("name");

-- CreateIndex
CREATE INDEX "operation_types_created_at_idx" ON "public"."operation_types"("created_at");

-- CreateIndex
CREATE INDEX "operations_user_idx" ON "public"."operations"("user_id");

-- CreateIndex
CREATE INDEX "operations_updated_by_idx" ON "public"."operations"("updated_by_id");

-- CreateIndex
CREATE INDEX "operations_type_idx" ON "public"."operations"("type_id");

-- CreateIndex
CREATE INDEX "operations_conversion_group_idx" ON "public"."operations"("conversion_group_id");

-- CreateIndex
CREATE INDEX "operations_deleted_idx" ON "public"."operations"("deleted");

-- CreateIndex
CREATE INDEX "operations_created_at_idx" ON "public"."operations"("created_at");

-- CreateIndex
CREATE INDEX "parser_data_created_at_idx" ON "public"."parser_data"("created_at");

-- CreateIndex
CREATE INDEX "parser_data_updated_at_idx" ON "public"."parser_data"("updated_at");

-- CreateIndex
CREATE INDEX "platforms_user_idx" ON "public"."platforms"("user_id");

-- CreateIndex
CREATE INDEX "platforms_updated_by_idx" ON "public"."platforms"("updated_by_id");

-- CreateIndex
CREATE INDEX "platforms_code_idx" ON "public"."platforms"("code");

-- CreateIndex
CREATE INDEX "platforms_deleted_idx" ON "public"."platforms"("deleted");

-- CreateIndex
CREATE UNIQUE INDEX "platforms_code_unique" ON "public"."platforms"("code");

-- CreateIndex
CREATE INDEX "revoked_tokens_revoked_by_idx" ON "public"."revoked_tokens"("revoked_by_id");

-- CreateIndex
CREATE INDEX "revoked_tokens_token_user_idx" ON "public"."revoked_tokens"("token_user_id");

-- CreateIndex
CREATE INDEX "revoked_tokens_token_expires_at_idx" ON "public"."revoked_tokens"("token_expires_at");

-- CreateIndex
CREATE INDEX "revoked_tokens_revoked_at_idx" ON "public"."revoked_tokens"("revoked_at");

-- CreateIndex
CREATE INDEX "revoked_tokens_user_revoked_idx" ON "public"."revoked_tokens"("token_user_id", "revoked_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "revoked_tokens_jti_unique" ON "public"."revoked_tokens"("jti");

-- CreateIndex
CREATE INDEX "roles_created_at_idx" ON "public"."roles"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "roles_code_unique" ON "public"."roles"("code");

-- CreateIndex
CREATE INDEX "sessions_user_idx" ON "public"."sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_jti_idx" ON "public"."sessions"("jti");

-- CreateIndex
CREATE INDEX "sessions_revoked_idx" ON "public"."sessions"("revoked");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "public"."sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_jti_key" ON "public"."sessions"("jti");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "users_telegram_id_idx" ON "public"."users"("telegram_id");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "public"."users"("created_at");

-- CreateIndex
CREATE INDEX "users_last_login_idx" ON "public"."users"("last_login");

-- CreateIndex
CREATE INDEX "users_deleted_created_idx" ON "public"."users"("deleted", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_unique" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_unique" ON "public"."users"("telegram_id");

-- CreateIndex
CREATE INDEX "wallet_categories_user_idx" ON "public"."wallet_categories"("user_id");

-- CreateIndex
CREATE INDEX "wallet_categories_updated_by_idx" ON "public"."wallet_categories"("updated_by_id");

-- CreateIndex
CREATE INDEX "wallet_categories_code_idx" ON "public"."wallet_categories"("code");

-- CreateIndex
CREATE INDEX "wallet_categories_deleted_idx" ON "public"."wallet_categories"("deleted");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_categories_code_unique" ON "public"."wallet_categories"("code");

-- CreateIndex
CREATE INDEX "wallet_details_user_idx" ON "public"."wallet_details"("user_id");

-- CreateIndex
CREATE INDEX "wallet_details_updated_by_idx" ON "public"."wallet_details"("updated_by_id");

-- CreateIndex
CREATE INDEX "wallet_details_wallet_idx" ON "public"."wallet_details"("wallet_id");

-- CreateIndex
CREATE INDEX "wallet_details_wallet_type_idx" ON "public"."wallet_details"("wallet_type_id");

-- CreateIndex
CREATE INDEX "wallet_details_platform_idx" ON "public"."wallet_details"("platform_id");

-- CreateIndex
CREATE INDEX "wallet_details_category_idx" ON "public"."wallet_details"("category_id");

-- CreateIndex
CREATE INDEX "wallet_details_network_idx" ON "public"."wallet_details"("network_id");

-- CreateIndex
CREATE INDEX "wallet_details_network_type_idx" ON "public"."wallet_details"("network_type_id");

-- CreateIndex
CREATE INDEX "wallet_details_phone_idx" ON "public"."wallet_details"("phone");

-- CreateIndex
CREATE INDEX "wallet_details_address_idx" ON "public"."wallet_details"("address");

-- CreateIndex
CREATE INDEX "wallet_details_account_id_idx" ON "public"."wallet_details"("account_id");

-- CreateIndex
CREATE INDEX "wallet_details_type_platform_idx" ON "public"."wallet_details"("wallet_type_id", "platform_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_details_wallet_unique" ON "public"."wallet_details"("wallet_id");

-- CreateIndex
CREATE INDEX "wallet_types_user_idx" ON "public"."wallet_types"("user_id");

-- CreateIndex
CREATE INDEX "wallet_types_updated_by_idx" ON "public"."wallet_types"("updated_by_id");

-- CreateIndex
CREATE INDEX "wallet_types_code_idx" ON "public"."wallet_types"("code");

-- CreateIndex
CREATE INDEX "wallet_types_deleted_idx" ON "public"."wallet_types"("deleted");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_types_code_unique" ON "public"."wallet_types"("code");

-- CreateIndex
CREATE INDEX "wallets_user_idx" ON "public"."wallets"("user_id");

-- CreateIndex
CREATE INDEX "wallets_updated_by_idx" ON "public"."wallets"("updated_by_id");

-- CreateIndex
CREATE INDEX "wallets_currency_idx" ON "public"."wallets"("currency_id");

-- CreateIndex
CREATE INDEX "wallets_active_idx" ON "public"."wallets"("active");

-- CreateIndex
CREATE INDEX "wallet_settings_pin_on_main_idx" ON "public"."wallets"("pin_on_main");

-- CreateIndex
CREATE INDEX "wallet_settings_pinned_idx" ON "public"."wallets"("pinned");

-- CreateIndex
CREATE INDEX "wallet_settings_visible_idx" ON "public"."wallets"("visible");

-- CreateIndex
CREATE INDEX "wallets_deleted_idx" ON "public"."wallets"("deleted");

-- CreateIndex
CREATE INDEX "wallets_created_at_idx" ON "public"."wallets"("created_at");

-- CreateIndex
CREATE INDEX "wallets_updated_at_idx" ON "public"."wallets"("updated_at");

-- CreateIndex
CREATE INDEX "_OperationToWallet_B_index" ON "public"."_OperationToWallet"("B");

-- CreateIndex
CREATE INDEX "_RoleToUser_B_index" ON "public"."_RoleToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_assignee_user_id_fkey" FOREIGN KEY ("assignee_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_operation_type_id_fkey" FOREIGN KEY ("operation_type_id") REFERENCES "public"."operation_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."applications" ADD CONSTRAINT "applications_operation_id_fkey" FOREIGN KEY ("operation_id") REFERENCES "public"."operations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."currencies" ADD CONSTRAINT "currencies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."currencies" ADD CONSTRAINT "currencies_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."guides" ADD CONSTRAINT "guides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."guides" ADD CONSTRAINT "guides_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."network_types" ADD CONSTRAINT "network_types_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."network_types" ADD CONSTRAINT "network_types_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."network_types" ADD CONSTRAINT "network_types_network_id_fkey" FOREIGN KEY ("network_id") REFERENCES "public"."networks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."networks" ADD CONSTRAINT "networks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."networks" ADD CONSTRAINT "networks_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operation_entries" ADD CONSTRAINT "operation_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operation_entries" ADD CONSTRAINT "operation_entries_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operation_entries" ADD CONSTRAINT "operation_entries_operation_id_fkey" FOREIGN KEY ("operation_id") REFERENCES "public"."operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operation_types" ADD CONSTRAINT "operation_types_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operation_types" ADD CONSTRAINT "operation_types_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operations" ADD CONSTRAINT "operations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operations" ADD CONSTRAINT "operations_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."operations" ADD CONSTRAINT "operations_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "public"."operation_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platforms" ADD CONSTRAINT "platforms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."platforms" ADD CONSTRAINT "platforms_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."revoked_tokens" ADD CONSTRAINT "revoked_tokens_revoked_by_id_fkey" FOREIGN KEY ("revoked_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."revoked_tokens" ADD CONSTRAINT "revoked_tokens_token_user_id_fkey" FOREIGN KEY ("token_user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallet_categories" ADD CONSTRAINT "wallet_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallet_categories" ADD CONSTRAINT "wallet_categories_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallet_details" ADD CONSTRAINT "wallet_details_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallet_details" ADD CONSTRAINT "wallet_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallet_details" ADD CONSTRAINT "wallet_details_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallet_details" ADD CONSTRAINT "wallet_details_wallet_type_id_fkey" FOREIGN KEY ("wallet_type_id") REFERENCES "public"."wallet_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallet_details" ADD CONSTRAINT "wallet_details_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallet_details" ADD CONSTRAINT "wallet_details_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."wallet_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallet_details" ADD CONSTRAINT "wallet_details_network_id_fkey" FOREIGN KEY ("network_id") REFERENCES "public"."networks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallet_details" ADD CONSTRAINT "wallet_details_network_type_id_fkey" FOREIGN KEY ("network_type_id") REFERENCES "public"."network_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallet_types" ADD CONSTRAINT "wallet_types_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallet_types" ADD CONSTRAINT "wallet_types_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallets" ADD CONSTRAINT "wallets_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."wallets" ADD CONSTRAINT "wallets_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "public"."currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_OperationToWallet" ADD CONSTRAINT "_OperationToWallet_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."operations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_OperationToWallet" ADD CONSTRAINT "_OperationToWallet_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert default roles
INSERT INTO "public"."roles" ("id", "code", "name", "deleted", "created_at", "updated_at") VALUES
    (gen_random_uuid(), 'user', 'User', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'admin', 'Admin', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'moderator', 'Moderator', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'holder', 'Holder', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'courier', 'Courier', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
