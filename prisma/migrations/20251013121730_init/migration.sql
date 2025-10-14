/*
  Warnings:

  - You are about to drop the column `comments` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `complaint` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `message` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_role` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."SendRole" AS ENUM ('DOCTOR', 'PATIENT');

-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_patient_id_fkey";

-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "comments",
DROP COLUMN "complaint",
DROP COLUMN "rating",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "sender_role" "public"."SendRole" NOT NULL,
ADD COLUMN     "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "public"."Complaint";

-- DropEnum
DROP TYPE "public"."Rating";
