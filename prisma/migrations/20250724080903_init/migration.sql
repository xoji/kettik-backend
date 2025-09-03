/*
  Warnings:

  - You are about to drop the `OTP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OTP" DROP CONSTRAINT "OTP_device_id_fkey";

-- DropForeignKey
ALTER TABLE "OTP" DROP CONSTRAINT "OTP_user_id_fkey";

-- AlterTable
ALTER TABLE "Devices" ADD COLUMN     "fcm_token" TEXT;

-- DropTable
DROP TABLE "OTP";
