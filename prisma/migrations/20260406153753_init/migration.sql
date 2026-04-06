-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('viewer', 'analyst', 'admin');

-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "RecordTypeEnum" AS ENUM ('income', 'expense');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "RoleEnum" NOT NULL DEFAULT 'viewer',
    "status" "StatusEnum" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_records" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "type" "RecordTypeEnum" NOT NULL,
    "category" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "description" TEXT,
    "created_by" TEXT NOT NULL,
    "user_id" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "financial_records_user_id_idx" ON "financial_records"("user_id");

-- CreateIndex
CREATE INDEX "financial_records_date_idx" ON "financial_records"("date");

-- CreateIndex
CREATE INDEX "financial_records_deleted_at_idx" ON "financial_records"("deleted_at");

-- AddForeignKey
ALTER TABLE "financial_records" ADD CONSTRAINT "financial_records_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_records" ADD CONSTRAINT "financial_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
