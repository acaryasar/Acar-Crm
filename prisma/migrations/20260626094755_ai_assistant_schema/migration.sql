-- CreateEnum
CREATE TYPE "public"."ConversationType" AS ENUM ('INITIAL_INQUIRY', 'INFORMATION_GATHERING', 'APPOINTMENT_SCHEDULING', 'ISSUE_RESOLUTION', 'FOLLOW_UP');

-- CreateEnum
CREATE TYPE "public"."CallDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "public"."CallStatus" AS ENUM ('COMPLETED', 'MISSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ChatStatus" AS ENUM ('ACTIVE', 'CLOSED', 'TRANSFERRED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."TicketStatus" ADD VALUE 'APPOINTMENT_CONFIRMED';
ALTER TYPE "public"."TicketStatus" ADD VALUE 'APPOINTMENT_CANCELLED';

-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "aiConfig" JSONB,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Ticket" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "locale" SET DEFAULT 'TR';

-- CreateTable
CREATE TABLE "public"."AIConversationLog" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "channelType" "public"."TicketSource" NOT NULL,
    "conversationType" "public"."ConversationType" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "audioRecordingUrl" TEXT,
    "chatLog" JSONB,
    "originalEmailId" TEXT,
    "aiIntent" TEXT,
    "aiConfidence" DOUBLE PRECISION,
    "aiExtractedEntities" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIConversationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WhatsAppMessage" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "conversationLogId" TEXT,
    "ticketId" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "messageFrom" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "mediaType" TEXT,
    "whatsappMessageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsAppMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PhoneCall" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "conversationLogId" TEXT,
    "ticketId" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "direction" "public"."CallDirection" NOT NULL,
    "duration" INTEGER,
    "recordingUrl" TEXT,
    "transcription" TEXT,
    "callStatus" "public"."CallStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhoneCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebChatSession" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "conversationLogId" TEXT,
    "ticketId" TEXT,
    "sessionId" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerName" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" "public"."ChatStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIConversationLog_ticketId_key" ON "public"."AIConversationLog"("ticketId");

-- CreateIndex
CREATE INDEX "AIConversationLog_companyId_idx" ON "public"."AIConversationLog"("companyId");

-- CreateIndex
CREATE INDEX "AIConversationLog_ticketId_idx" ON "public"."AIConversationLog"("ticketId");

-- CreateIndex
CREATE INDEX "AIConversationLog_channelType_idx" ON "public"."AIConversationLog"("channelType");

-- CreateIndex
CREATE INDEX "AIConversationLog_createdAt_idx" ON "public"."AIConversationLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppMessage_whatsappMessageId_key" ON "public"."WhatsAppMessage"("whatsappMessageId");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_companyId_idx" ON "public"."WhatsAppMessage"("companyId");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_ticketId_idx" ON "public"."WhatsAppMessage"("ticketId");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_phoneNumber_idx" ON "public"."WhatsAppMessage"("phoneNumber");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_createdAt_idx" ON "public"."WhatsAppMessage"("createdAt");

-- CreateIndex
CREATE INDEX "PhoneCall_companyId_idx" ON "public"."PhoneCall"("companyId");

-- CreateIndex
CREATE INDEX "PhoneCall_ticketId_idx" ON "public"."PhoneCall"("ticketId");

-- CreateIndex
CREATE INDEX "PhoneCall_phoneNumber_idx" ON "public"."PhoneCall"("phoneNumber");

-- CreateIndex
CREATE INDEX "PhoneCall_createdAt_idx" ON "public"."PhoneCall"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebChatSession_sessionId_key" ON "public"."WebChatSession"("sessionId");

-- CreateIndex
CREATE INDEX "WebChatSession_companyId_idx" ON "public"."WebChatSession"("companyId");

-- CreateIndex
CREATE INDEX "WebChatSession_ticketId_idx" ON "public"."WebChatSession"("ticketId");

-- CreateIndex
CREATE INDEX "WebChatSession_sessionId_idx" ON "public"."WebChatSession"("sessionId");

-- CreateIndex
CREATE INDEX "WebChatSession_createdAt_idx" ON "public"."WebChatSession"("createdAt");

-- CreateIndex
CREATE INDEX "Appointment_deletedAt_idx" ON "public"."Appointment"("deletedAt");

-- CreateIndex
CREATE INDEX "Company_deletedAt_idx" ON "public"."Company"("deletedAt");

-- CreateIndex
CREATE INDEX "Customer_deletedAt_idx" ON "public"."Customer"("deletedAt");

-- CreateIndex
CREATE INDEX "Ticket_deletedAt_idx" ON "public"."Ticket"("deletedAt");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "public"."User"("deletedAt");

-- AddForeignKey
ALTER TABLE "public"."AIConversationLog" ADD CONSTRAINT "AIConversationLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AIConversationLog" ADD CONSTRAINT "AIConversationLog_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_conversationLogId_fkey" FOREIGN KEY ("conversationLogId") REFERENCES "public"."AIConversationLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsAppMessage" ADD CONSTRAINT "WhatsAppMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhoneCall" ADD CONSTRAINT "PhoneCall_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhoneCall" ADD CONSTRAINT "PhoneCall_conversationLogId_fkey" FOREIGN KEY ("conversationLogId") REFERENCES "public"."AIConversationLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhoneCall" ADD CONSTRAINT "PhoneCall_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebChatSession" ADD CONSTRAINT "WebChatSession_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebChatSession" ADD CONSTRAINT "WebChatSession_conversationLogId_fkey" FOREIGN KEY ("conversationLogId") REFERENCES "public"."AIConversationLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebChatSession" ADD CONSTRAINT "WebChatSession_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
