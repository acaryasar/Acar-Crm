/*
  Warnings:

  - The values [DONE] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `customerId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('PLANNED', 'COMPLETED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TicketStatus_new" AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_PARTS', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."Ticket" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Ticket" ALTER COLUMN "status" TYPE "public"."TicketStatus_new" USING ("status"::text::"public"."TicketStatus_new");
ALTER TYPE "public"."TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "public"."TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "public"."TicketStatus_old";
ALTER TABLE "public"."Ticket" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "employeeId" TEXT,
ADD COLUMN     "status" "public"."AppointmentStatus" NOT NULL DEFAULT 'PLANNED';

-- CreateTable
CREATE TABLE "public"."TicketComment" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketComment_pkey" PRIMARY KEY ("id")
);


-- CreateIndex
CREATE INDEX "TicketComment_ticketId_idx" ON "public"."TicketComment"("ticketId");

-- CreateIndex

-- CreateIndex
CREATE INDEX "Appointment_customerId_idx" ON "public"."Appointment"("customerId");

-- CreateIndex
CREATE INDEX "Appointment_employeeId_idx" ON "public"."Appointment"("employeeId");

-- AddForeignKey
ALTER TABLE "public"."TicketComment" ADD CONSTRAINT "TicketComment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "public"."Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TicketComment" ADD CONSTRAINT "TicketComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
