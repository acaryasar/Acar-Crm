-- CreateEnum
CREATE TYPE "public"."Locale" AS ENUM ('EN', 'DE', 'FR', 'RU', 'TR');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "locale" "public"."Locale" NOT NULL DEFAULT 'EN';
