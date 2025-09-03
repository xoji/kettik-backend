/*
  Warnings:

  - You are about to drop the column `app_verion` on the `Devices` table. All the data in the column will be lost.
  - Added the required column `app_version` to the `Devices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Devices" DROP COLUMN "app_verion",
ADD COLUMN     "app_version" TEXT NOT NULL;
