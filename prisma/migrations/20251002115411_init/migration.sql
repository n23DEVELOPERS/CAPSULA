-- AlterTable
ALTER TABLE "public"."Doctor_docs" ALTER COLUMN "diplom_url" DROP NOT NULL,
ALTER COLUMN "certificate_url" DROP NOT NULL,
ALTER COLUMN "self_employment_url" DROP NOT NULL,
ALTER COLUMN "image_url" DROP NOT NULL;
