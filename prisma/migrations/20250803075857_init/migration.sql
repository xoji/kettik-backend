/*
  Warnings:

  - The primary key for the `Ride` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `ride_id` column on the `Transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `ride_id` on the `Chats` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ride_id` on the `Points` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ride_id` on the `Reviews` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Ride` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ride_id` on the `RideIndexes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ride_id` on the `Trips` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Chats" DROP CONSTRAINT "Chats_ride_id_fkey";

-- DropForeignKey
ALTER TABLE "Points" DROP CONSTRAINT "Points_ride_id_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_ride_id_fkey";

-- DropForeignKey
ALTER TABLE "RideIndexes" DROP CONSTRAINT "RideIndexes_ride_id_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_ride_id_fkey";

-- DropForeignKey
ALTER TABLE "Trips" DROP CONSTRAINT "Trips_ride_id_fkey";

-- AlterTable
ALTER TABLE "Chats" DROP COLUMN "ride_id",
ADD COLUMN     "ride_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Points" DROP COLUMN "ride_id",
ADD COLUMN     "ride_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "ride_id",
ADD COLUMN     "ride_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Ride_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RideIndexes" DROP COLUMN "ride_id",
ADD COLUMN     "ride_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "ride_id",
ADD COLUMN     "ride_id" UUID;

-- AlterTable
ALTER TABLE "Trips" DROP COLUMN "ride_id",
ADD COLUMN     "ride_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ride_id_key" ON "Ride"("id");

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Points" ADD CONSTRAINT "Points_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideIndexes" ADD CONSTRAINT "RideIndexes_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE SET NULL ON UPDATE CASCADE;
