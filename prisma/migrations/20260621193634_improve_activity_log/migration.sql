/*
  Warnings:

  - Added the required column `companyId` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ActivityLog" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "ipAddress" TEXT;

-- CreateIndex
CREATE INDEX "ActivityLog_companyId_idx" ON "public"."ActivityLog"("companyId");

-- CreateIndex
CREATE INDEX "ActivityLog_entityType_idx" ON "public"."ActivityLog"("entityType");

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
