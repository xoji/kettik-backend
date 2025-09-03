-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ru', 'uz', 'en');

-- AlterTable
ALTER TABLE "Devices" ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'uz';
