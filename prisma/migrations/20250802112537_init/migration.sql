/*
  Warnings:

  - Added the required column `card_id` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `method` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('card', 'cash');

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'service';

-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "card_id" UUID NOT NULL,
ADD COLUMN     "payment_method" "PaymentMethod" NOT NULL;

-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "method" "PaymentMethod" NOT NULL;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
