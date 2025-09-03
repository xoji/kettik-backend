-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('available', 'blocked');

-- AlterTable
ALTER TABLE "DriverLicenseVerification" ADD COLUMN     "reject_comment" JSONB;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'available';

-- AlterTable
ALTER TABLE "VehicleLicenseVerification" ADD COLUMN     "reject_comment" JSONB;

-- AlterTable
ALTER TABLE "VehicleVerification" ADD COLUMN     "reject_comment" JSONB;
