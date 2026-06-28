/*
  Warnings:

  - You are about to drop the `TicketComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AIConversationLog" DROP CONSTRAINT "AIConversationLog_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TicketComment" DROP CONSTRAINT "TicketComment_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TicketComment" DROP CONSTRAINT "TicketComment_userId_fkey";

-- AlterTable
ALTER TABLE "public"."AIConversationLog" ALTER COLUMN "ticketId" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."TicketComment";

-- CreateTable
CREATE TABLE "public"."SalesType" (
    "id" TEXT NOT NULL,
    "guidId" TEXT NOT NULL,
    "name" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Currency" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomerType" (
    "id" TEXT NOT NULL,
    "typeName" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "CustomerType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Department" (
    "id" TEXT NOT NULL,
    "departmentName" TEXT NOT NULL,
    "departmentUpper" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BankAccount" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "swiftNumber" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CargoFirm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "CargoFirm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomerAuthority" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "gsm" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "CustomerAuthority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT,
    "departmentId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TaxOffice" (
    "id" TEXT NOT NULL,
    "plateCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "districtName" TEXT NOT NULL,
    "muhasebeBirimiKodu" TEXT NOT NULL,
    "taxOfficeName" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "TaxOffice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalesType_guidId_key" ON "public"."SalesType"("guidId");

-- CreateIndex
CREATE INDEX "SalesType_guidId_idx" ON "public"."SalesType"("guidId");

-- CreateIndex
CREATE INDEX "Currency_deletedAt_idx" ON "public"."Currency"("deletedAt");

-- CreateIndex
CREATE INDEX "CustomerType_deletedAt_idx" ON "public"."CustomerType"("deletedAt");

-- CreateIndex
CREATE INDEX "Bank_deletedAt_idx" ON "public"."Bank"("deletedAt");

-- CreateIndex
CREATE INDEX "BankAccount_deletedAt_idx" ON "public"."BankAccount"("deletedAt");

-- CreateIndex
CREATE INDEX "BankAccount_bankId_idx" ON "public"."BankAccount"("bankId");

-- CreateIndex
CREATE INDEX "BankAccount_currencyId_idx" ON "public"."BankAccount"("currencyId");

-- CreateIndex
CREATE INDEX "CargoFirm_deletedAt_idx" ON "public"."CargoFirm"("deletedAt");

-- CreateIndex
CREATE INDEX "CustomerAuthority_deletedAt_idx" ON "public"."CustomerAuthority"("deletedAt");

-- CreateIndex
CREATE INDEX "Employee_deletedAt_idx" ON "public"."Employee"("deletedAt");

-- CreateIndex
CREATE INDEX "Employee_departmentId_idx" ON "public"."Employee"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "TaxOffice_muhasebeBirimiKodu_key" ON "public"."TaxOffice"("muhasebeBirimiKodu");

-- CreateIndex
CREATE INDEX "TaxOffice_deletedAt_idx" ON "public"."TaxOffice"("deletedAt");

-- CreateIndex
CREATE INDEX "TaxOffice_plateCode_idx" ON "public"."TaxOffice"("plateCode");

-- CreateIndex
CREATE INDEX "TaxOffice_muhasebeBirimiKodu_idx" ON "public"."TaxOffice"("muhasebeBirimiKodu");

-- AddForeignKey
ALTER TABLE "public"."AIConversationLog" ADD CONSTRAINT "AIConversationLog_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BankAccount" ADD CONSTRAINT "BankAccount_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "public"."Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BankAccount" ADD CONSTRAINT "BankAccount_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "public"."Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
