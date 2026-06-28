-- CreateTable
CREATE TABLE "public"."EmailInbox" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "fromName" TEXT,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "ticketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailInbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailInbox_messageId_key" ON "public"."EmailInbox"("messageId");

-- CreateIndex
CREATE INDEX "EmailInbox_companyId_idx" ON "public"."EmailInbox"("companyId");

-- CreateIndex
CREATE INDEX "EmailInbox_processed_idx" ON "public"."EmailInbox"("processed");

-- AddForeignKey
ALTER TABLE "public"."EmailInbox" ADD CONSTRAINT "EmailInbox_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EmailInbox" ADD CONSTRAINT "EmailInbox_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
