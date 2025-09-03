-- CreateEnum
CREATE TYPE "OtpStatus" AS ENUM ('waiting', 'submitted', 'canceled');

-- CreateTable
CREATE TABLE "OTP" (
    "id" UUID NOT NULL,
    "code" INTEGER NOT NULL,
    "status" "OtpStatus" NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" BIGINT NOT NULL,
    "device_id" UUID NOT NULL,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OTP_id_key" ON "OTP"("id");

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
