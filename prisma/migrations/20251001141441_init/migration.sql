/*
  Warnings:

  - You are about to drop the column `hashed_password` on the `Doctor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Doctor" DROP COLUMN "hashed_password",
ALTER COLUMN "is_active" SET DEFAULT false;
