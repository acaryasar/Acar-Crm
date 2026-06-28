-- DropForeignKey
ALTER TABLE "public"."EmailInbox" DROP CONSTRAINT "EmailInbox_ticketId_fkey";

-- AlterTable
ALTER TABLE "public"."EmailInbox" ADD COLUMN     "processingError" TEXT,
ALTER COLUMN "ticketId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "EmailInbox_createdAt_idx" ON "public"."EmailInbox"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."EmailInbox" ADD CONSTRAINT "EmailInbox_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
