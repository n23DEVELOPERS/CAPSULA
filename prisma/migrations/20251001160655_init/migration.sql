/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Book_doctor` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Doctor_book_time` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Doctor_docs` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Speciality` table. All the data in the column will be lost.
  - You are about to drop the column `doctorId` on the `Wallet` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `doctor_id` to the `Book_doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctor_id` to the `Doctor_book_time` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctor_id` to the `Doctor_docs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctor_id` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doctor_id` to the `Speciality` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Book_doctor" DROP CONSTRAINT "Book_doctor_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Doctor_book_time" DROP CONSTRAINT "Doctor_book_time_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Doctor_docs" DROP CONSTRAINT "Doctor_docs_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Service" DROP CONSTRAINT "Service_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Speciality" DROP CONSTRAINT "Speciality_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Wallet" DROP CONSTRAINT "Wallet_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Wallet" DROP CONSTRAINT "Wallet_patientId_fkey";

-- AlterTable
ALTER TABLE "public"."Book_doctor" DROP COLUMN "doctorId",
ADD COLUMN     "doctor_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Doctor_book_time" DROP COLUMN "doctorId",
ADD COLUMN     "doctor_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Doctor_docs" DROP COLUMN "doctorId",
ADD COLUMN     "doctor_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Service" DROP COLUMN "doctorId",
ADD COLUMN     "doctor_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Speciality" DROP COLUMN "doctorId",
ADD COLUMN     "doctor_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Wallet" DROP COLUMN "doctorId",
DROP COLUMN "patientId",
ADD COLUMN     "user_id" INTEGER,
ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "date" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."Doctor_docs" ADD CONSTRAINT "Doctor_docs_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctor_book_time" ADD CONSTRAINT "Doctor_book_time_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Speciality" ADD CONSTRAINT "Speciality_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Service" ADD CONSTRAINT "Service_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Book_doctor" ADD CONSTRAINT "Book_doctor_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
