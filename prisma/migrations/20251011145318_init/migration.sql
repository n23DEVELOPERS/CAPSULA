-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('SUPERADMIN', 'ADMIN', 'DOCTOR', 'PATIENT');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "public"."BookDoctorStatus" AS ENUM ('PENDING', 'PROCESS', 'SUCCESS', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."Rating" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE');

-- CreateEnum
CREATE TYPE "public"."Complaint" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."Payment_type" AS ENUM ('CASH', 'CARD');

-- CreateEnum
CREATE TYPE "public"."Wallet_type" AS ENUM ('HUMO', 'UZCARD', 'VISA', 'MASTERCARD');

-- CreateEnum
CREATE TYPE "public"."DoctorSpeciality" AS ENUM ('CARDIOLOGIST', 'DERMATOLOGIST', 'NEUROLOGIST', 'PEDIATRICIAN', 'ORTHOPEDIC', 'GYNECOLOGIST', 'UROLOGIST', 'ENDOCRINOLOGIST', 'PSYCHIATRIST', 'RADIOLOGIST', 'ONCOLOGIST', 'OPHTHALMOLOGIST', 'OTOLARYNGOLOGIST', 'DENTIST', 'SURGEON', 'NEPHROLOGIST', 'HEMATOLOGIST', 'GASTROENTEROLOGIST');

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "role" "public"."Roles" NOT NULL DEFAULT 'ADMIN',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctor" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "is_delete" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."Roles" NOT NULL DEFAULT 'DOCTOR',

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Patient" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "public"."Gender" NOT NULL DEFAULT 'MALE',
    "hashed_password" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "role" "public"."Roles" NOT NULL DEFAULT 'PATIENT',

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctor_docs" (
    "id" SERIAL NOT NULL,
    "passport_url" TEXT,
    "diplom_url" TEXT,
    "certificate_url" TEXT,
    "self_employment_url" TEXT,
    "image_url" TEXT,
    "doctor_id" INTEGER NOT NULL,

    CONSTRAINT "Doctor_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "doctor_docs_id" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctor_book_time" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "doctor_id" INTEGER NOT NULL,

    CONSTRAINT "Doctor_book_time_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Speciality" (
    "id" SERIAL NOT NULL,
    "name" "public"."DoctorSpeciality" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,

    CONSTRAINT "Speciality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Book_doctor" (
    "id" SERIAL NOT NULL,
    "book_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "status" "public"."BookDoctorStatus" NOT NULL DEFAULT 'PENDING',
    "location" TEXT NOT NULL,
    "service_id" INTEGER NOT NULL,
    "speciality_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,

    CONSTRAINT "Book_doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" SERIAL NOT NULL,
    "rating" "public"."Rating" NOT NULL DEFAULT 'ONE',
    "comments" TEXT NOT NULL,
    "complaint" "public"."Complaint" NOT NULL DEFAULT 'PENDING',
    "doctor_id" INTEGER NOT NULL,
    "patient_id" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AiChat" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" SERIAL NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "patient_name" TEXT NOT NULL,
    "doctor_name" TEXT NOT NULL,
    "payment_type" "public"."Payment_type" NOT NULL DEFAULT 'CARD',
    "meeting_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "book_doctor_id" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Wallet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "card_number" TEXT NOT NULL,
    "type" "public"."Wallet_type" NOT NULL DEFAULT 'HUMO',
    "date" TEXT NOT NULL,
    "cvv" INTEGER NOT NULL,
    "balence" INTEGER NOT NULL DEFAULT 0,
    "patient_id" INTEGER,
    "doctor_id" INTEGER,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_DoctorToSpeciality" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DoctorToSpeciality_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_DoctorToService" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DoctorToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "public"."Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_phone_number_key" ON "public"."Admin"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_phone_number_key" ON "public"."Doctor"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phone_number_key" ON "public"."Patient"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Speciality_name_key" ON "public"."Speciality"("name");

-- CreateIndex
CREATE INDEX "_DoctorToSpeciality_B_index" ON "public"."_DoctorToSpeciality"("B");

-- CreateIndex
CREATE INDEX "_DoctorToService_B_index" ON "public"."_DoctorToService"("B");

-- AddForeignKey
ALTER TABLE "public"."Doctor_docs" ADD CONSTRAINT "Doctor_docs_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_doctor_docs_id_fkey" FOREIGN KEY ("doctor_docs_id") REFERENCES "public"."Doctor_docs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doctor_book_time" ADD CONSTRAINT "Doctor_book_time_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Book_doctor" ADD CONSTRAINT "Book_doctor_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Book_doctor" ADD CONSTRAINT "Book_doctor_speciality_id_fkey" FOREIGN KEY ("speciality_id") REFERENCES "public"."Speciality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Book_doctor" ADD CONSTRAINT "Book_doctor_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Book_doctor" ADD CONSTRAINT "Book_doctor_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AiChat" ADD CONSTRAINT "AiChat_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_book_doctor_id_fkey" FOREIGN KEY ("book_doctor_id") REFERENCES "public"."Book_doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DoctorToSpeciality" ADD CONSTRAINT "_DoctorToSpeciality_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DoctorToSpeciality" ADD CONSTRAINT "_DoctorToSpeciality_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Speciality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DoctorToService" ADD CONSTRAINT "_DoctorToService_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DoctorToService" ADD CONSTRAINT "_DoctorToService_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
