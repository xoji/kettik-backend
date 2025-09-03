-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('rejected', 'pending', 'accepted');

-- CreateEnum
CREATE TYPE "HistoryStatus" AS ENUM ('deleted', 'expired');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('submitted', 'pending', 'expired');

-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('waiting', 'started', 'finished', 'canceled');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('waiting', 'started', 'finished');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('payment', 'withdraw');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('pending', 'success', 'canceled');

-- CreateTable
CREATE TABLE "Users" (
    "id" BIGSERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "gender" "Gender",
    "pinfl" TEXT,
    "birth" BIGINT,
    "nationality" TEXT,
    "passport_series" TEXT,
    "passport_number" INTEGER,
    "passport_exp" BIGINT,
    "photo" TEXT,
    "my_id_photo" TEXT,
    "phone_number" VARCHAR(20) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "user_verification" BOOLEAN NOT NULL DEFAULT false,
    "driver_verification" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Devices" (
    "id" UUID NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "OS" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "user_id" BIGINT,
    "app_verion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverLicense" (
    "id" UUID NOT NULL,
    "exp" TEXT NOT NULL,
    "series" VARCHAR(5) NOT NULL,
    "number" INTEGER NOT NULL,
    "photo_front" TEXT,
    "photo_back" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "DriverLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverLicenseVerification" (
    "id" UUID NOT NULL,
    "photo_front" TEXT NOT NULL,
    "photo_back" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "status_datetime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "license_id" UUID NOT NULL,
    "staff_id" UUID,

    CONSTRAINT "DriverLicenseVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverLicenseHistory" (
    "id" UUID NOT NULL,
    "exp" TEXT NOT NULL,
    "series" VARCHAR(5) NOT NULL,
    "number" INTEGER NOT NULL,
    "photo_front" TEXT,
    "photo_back" TEXT,
    "accepted_date" TIMESTAMP(3) NOT NULL,
    "status" "HistoryStatus" NOT NULL DEFAULT 'expired',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" BIGINT NOT NULL,
    "staff_id" UUID,

    CONSTRAINT "DriverLicenseHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cars" (
    "id" UUID NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "vin" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "Cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleVerification" (
    "id" UUID NOT NULL,
    "photo_front" TEXT NOT NULL,
    "photo_left" TEXT NOT NULL,
    "photo_back" TEXT NOT NULL,
    "photo_right" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "status_datetime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "car_id" UUID NOT NULL,
    "staff_id" UUID,

    CONSTRAINT "VehicleVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleLicense" (
    "id" UUID NOT NULL,
    "series" VARCHAR(5) NOT NULL,
    "number" INTEGER NOT NULL,
    "exp" TIMESTAMP(3) NOT NULL,
    "photo_front" TEXT NOT NULL,
    "photo_back" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "car_id" UUID NOT NULL,

    CONSTRAINT "VehicleLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleLicenseVerification" (
    "id" UUID NOT NULL,
    "photo_front" TEXT NOT NULL,
    "photo_back" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "status_datetime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vehicle_license_id" UUID NOT NULL,
    "staff_id" UUID,

    CONSTRAINT "VehicleLicenseVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cards" (
    "id" UUID NOT NULL,
    "number" TEXT NOT NULL,
    "exp" TEXT NOT NULL,
    "placeholder" TEXT,
    "card_type" TEXT NOT NULL,
    "status" "CardStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "Cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" UUID NOT NULL,
    "balance" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ride" (
    "id" BIGSERIAL NOT NULL,
    "seats" INTEGER NOT NULL,
    "start_datetime" TIMESTAMP(3) NOT NULL,
    "status" "RideStatus" NOT NULL DEFAULT 'waiting',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "driver_id" BIGINT NOT NULL,
    "car_id" UUID NOT NULL,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "id" UUID NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "comment" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "from_user_id" BIGINT NOT NULL,
    "to_user_id" BIGINT NOT NULL,
    "ride_id" BIGINT NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chats" (
    "id" UUID NOT NULL,
    "finished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "driver_id" BIGINT NOT NULL,
    "passenger_id" BIGINT NOT NULL,
    "ride_id" BIGINT NOT NULL,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessages" (
    "id" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sender_id" BIGINT NOT NULL,
    "chat_id" UUID NOT NULL,

    CONSTRAINT "ChatMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Points" (
    "id" UUID NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "full_address" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ride_id" BIGINT NOT NULL,

    CONSTRAINT "Points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RideIndexes" (
    "id" UUID NOT NULL,
    "occupied" INTEGER NOT NULL DEFAULT 0,
    "index" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "from_point_id" UUID NOT NULL,
    "to_point_id" UUID NOT NULL,
    "ride_id" BIGINT NOT NULL,

    CONSTRAINT "RideIndexes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trips" (
    "id" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "price" BIGINT NOT NULL,
    "duration" BIGINT NOT NULL,
    "distance" INTEGER NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'waiting',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "from_point_id" UUID NOT NULL,
    "to_point_id" UUID NOT NULL,
    "ride_id" BIGINT NOT NULL,

    CONSTRAINT "Trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookings" (
    "id" UUID NOT NULL,
    "canceled" BOOLEAN NOT NULL DEFAULT false,
    "seats" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "trip_id" UUID NOT NULL,
    "user_id_made_booking" BIGINT NOT NULL,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingUsers" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "book_id" UUID NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "BookingUsers_pkey" PRIMARY KEY ("book_id","user_id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" UUID NOT NULL,
    "billing_transaction_id" TEXT NOT NULL,
    "system_transaction_id" TEXT NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "payment_system" TEXT NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "card_id" UUID,
    "wallet_id" UUID,
    "user_id" BIGINT NOT NULL,
    "ride_id" BIGINT,
    "trip_id" UUID,
    "booking_id" UUID,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Devices_id_key" ON "Devices"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_id_key" ON "Staff"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DriverLicense_id_key" ON "DriverLicense"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DriverLicense_user_id_key" ON "DriverLicense"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "DriverLicenseVerification_id_key" ON "DriverLicenseVerification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DriverLicenseHistory_id_key" ON "DriverLicenseHistory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DriverLicenseHistory_user_id_key" ON "DriverLicenseHistory"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Cars_id_key" ON "Cars"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleVerification_id_key" ON "VehicleVerification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleLicense_id_key" ON "VehicleLicense"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleLicense_car_id_key" ON "VehicleLicense"("car_id");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleLicenseVerification_id_key" ON "VehicleLicenseVerification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Cards_id_key" ON "Cards"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_id_key" ON "Wallet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_user_id_key" ON "Wallet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ride_id_key" ON "Ride"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_id_key" ON "Reviews"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Chats_id_key" ON "Chats"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessages_id_key" ON "ChatMessages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Points_id_key" ON "Points"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RideIndexes_id_key" ON "RideIndexes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Trips_id_key" ON "Trips"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Bookings_id_key" ON "Bookings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_id_key" ON "Transactions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Transactions_billing_transaction_id_key" ON "Transactions"("billing_transaction_id");

-- AddForeignKey
ALTER TABLE "Devices" ADD CONSTRAINT "Devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverLicense" ADD CONSTRAINT "DriverLicense_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverLicenseVerification" ADD CONSTRAINT "DriverLicenseVerification_license_id_fkey" FOREIGN KEY ("license_id") REFERENCES "DriverLicense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverLicenseVerification" ADD CONSTRAINT "DriverLicenseVerification_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverLicenseHistory" ADD CONSTRAINT "DriverLicenseHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverLicenseHistory" ADD CONSTRAINT "DriverLicenseHistory_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cars" ADD CONSTRAINT "Cars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleVerification" ADD CONSTRAINT "VehicleVerification_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleVerification" ADD CONSTRAINT "VehicleVerification_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleLicense" ADD CONSTRAINT "VehicleLicense_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleLicenseVerification" ADD CONSTRAINT "VehicleLicenseVerification_vehicle_license_id_fkey" FOREIGN KEY ("vehicle_license_id") REFERENCES "VehicleLicense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleLicenseVerification" ADD CONSTRAINT "VehicleLicenseVerification_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "Cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessages" ADD CONSTRAINT "ChatMessages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessages" ADD CONSTRAINT "ChatMessages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Points" ADD CONSTRAINT "Points_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideIndexes" ADD CONSTRAINT "RideIndexes_from_point_id_fkey" FOREIGN KEY ("from_point_id") REFERENCES "Points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideIndexes" ADD CONSTRAINT "RideIndexes_to_point_id_fkey" FOREIGN KEY ("to_point_id") REFERENCES "Points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RideIndexes" ADD CONSTRAINT "RideIndexes_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_from_point_id_fkey" FOREIGN KEY ("from_point_id") REFERENCES "Points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_to_point_id_fkey" FOREIGN KEY ("to_point_id") REFERENCES "Points"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_user_id_made_booking_fkey" FOREIGN KEY ("user_id_made_booking") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingUsers" ADD CONSTRAINT "BookingUsers_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingUsers" ADD CONSTRAINT "BookingUsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "Ride"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
