/*
  Warnings:

  - You are about to drop the `Message` table. All the data in the table will be lost.
  - You are about to drop the `Conversation` table. All the data in the table will be lost.
  - You are about to drop the `CustomerActivity` table. All the data in the table will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropTable
DROP TABLE "public"."Message";

-- DropTable
DROP TABLE "public"."Conversation";

-- DropTable
DROP TABLE "public"."CustomerActivity";
