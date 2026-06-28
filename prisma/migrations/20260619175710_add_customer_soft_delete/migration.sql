-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Ticket" ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- CreateIndex
CREATE INDEX "Ticket_assignedUserId_idx" ON "public"."Ticket"("assignedUserId");
