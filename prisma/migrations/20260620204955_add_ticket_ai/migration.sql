-- AlterTable
ALTER TABLE "public"."Ticket" ADD COLUMN     "aiCategory" TEXT,
ADD COLUMN     "aiConfidence" DOUBLE PRECISION,
ADD COLUMN     "aiExtractedData" JSONB,
ADD COLUMN     "aiProcessedAt" TIMESTAMP(3),
ADD COLUMN     "aiSuggestedTitle" TEXT,
ADD COLUMN     "aiSummary" TEXT;

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "public"."Ticket"("status");

-- CreateIndex
CREATE INDEX "Ticket_priority_idx" ON "public"."Ticket"("priority");
