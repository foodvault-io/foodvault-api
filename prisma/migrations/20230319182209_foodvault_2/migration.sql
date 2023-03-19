/*
  Warnings:

  - You are about to drop the column `userId` on the `KitchenDetails` table. All the data in the column will be lost.
  - The `status` column on the `KitchenDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Cities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `KitchenDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId]` on the table `KitchenDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `KitchenDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('admin', 'user', 'kitchen', 'chef');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'pending', 'rejected', 'suspended');

-- CreateEnum
CREATE TYPE "KitchenStatus" AS ENUM ('active', 'inactive', 'pending', 'rejected', 'suspended');

-- CreateEnum
CREATE TYPE "ChefStatus" AS ENUM ('active', 'inactive', 'pending', 'rejected', 'suspended');

-- CreateEnum
CREATE TYPE "TimeSlotStatus" AS ENUM ('available', 'booked', 'pending', 'cancelled');

-- CreateEnum
CREATE TYPE "CreditStatus" AS ENUM ('active', 'inactive');

-- DropForeignKey
ALTER TABLE "Cities" DROP CONSTRAINT "Cities_stateId_fkey";

-- DropForeignKey
ALTER TABLE "KitchenDetails" DROP CONSTRAINT "KitchenDetails_cityId_fkey";

-- DropForeignKey
ALTER TABLE "KitchenDetails" DROP CONSTRAINT "KitchenDetails_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropIndex
DROP INDEX "KitchenDetails_userId_key";

-- AlterTable
ALTER TABLE "Certificates" ADD COLUMN     "chefDetailsId" TEXT,
ALTER COLUMN "fileSize" SET DATA TYPE BIGINT,
ALTER COLUMN "kitchenDetailsId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "KitchenDetails" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "KitchenStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "chefDetailsId" TEXT,
ALTER COLUMN "fileSize" SET DATA TYPE BIGINT,
ALTER COLUMN "kitchenDetailsId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roleId",
ADD COLUMN     "role" "RoleEnum" NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Cities";

-- DropTable
DROP TABLE "Role";

-- CreateTable
CREATE TABLE "KitchenUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "status" "UserStatus" NOT NULL DEFAULT 'pending',
    "userId" TEXT NOT NULL,

    CONSTRAINT "KitchenUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChefUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "status" "UserStatus" NOT NULL DEFAULT 'pending',
    "identificationUrl" TEXT NOT NULL,
    "accountCredits" INTEGER NOT NULL DEFAULT 0,
    "purchaseDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChefUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChefCompanyDetails" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT,
    "status" "ChefStatus" NOT NULL DEFAULT 'pending',
    "address" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "lat" TEXT,
    "lon" TEXT,
    "kitchensAllowed" INTEGER,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "ChefCompanyDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KitchenReviews" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "kitchenDetailsId" TEXT NOT NULL,
    "chefId" TEXT NOT NULL,

    CONSTRAINT "KitchenReviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChefReviews" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "chefDetailsId" TEXT NOT NULL,
    "kitchenDetailsId" TEXT NOT NULL,

    CONSTRAINT "ChefReviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "creditCost" INTEGER NOT NULL,
    "creditPaid" INTEGER,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isRefunded" BOOLEAN NOT NULL DEFAULT false,
    "refundReason" TEXT,
    "refundDate" TIMESTAMP(3),
    "refundAmount" INTEGER,
    "timeSlotDate" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "timeSlotDuration" INTEGER NOT NULL,
    "timeSlotType" TEXT,
    "timeSlotNotes" TEXT,
    "timeSlotStatus" "TimeSlotStatus" NOT NULL DEFAULT 'available',
    "timeZone" TEXT,
    "canceledDate" TIMESTAMP(3),
    "rejectedDate" TIMESTAMP(3),
    "cancelationReasons" TEXT,
    "rejectionReason" TEXT,
    "chefId" TEXT,
    "chefsAttending" INTEGER NOT NULL,
    "kitchenDetailsId" TEXT NOT NULL,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditPackages" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creditsGranted" INTEGER NOT NULL,
    "pricePerCredit" DECIMAL(65,30) NOT NULL,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "status" "CreditStatus" NOT NULL DEFAULT 'active',

    CONSTRAINT "CreditPackages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoughtCredits" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "creditsBought" INTEGER NOT NULL,
    "transactoinId" TEXT NOT NULL,
    "creditPackageId" TEXT NOT NULL,
    "chefId" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,

    CONSTRAINT "BoughtCredits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "paymentId" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "paymentAmount" DECIMAL(65,30) NOT NULL,
    "paymentCurrency" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentNotes" TEXT,
    "chefId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KitchenUser_userId_key" ON "KitchenUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChefUser_userId_key" ON "ChefUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "KitchenDetails_name_key" ON "KitchenDetails"("name");

-- CreateIndex
CREATE UNIQUE INDEX "KitchenDetails_ownerId_key" ON "KitchenDetails"("ownerId");

-- AddForeignKey
ALTER TABLE "KitchenUser" ADD CONSTRAINT "KitchenUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChefUser" ADD CONSTRAINT "ChefUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitchenDetails" ADD CONSTRAINT "KitchenDetails_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitchenDetails" ADD CONSTRAINT "KitchenDetails_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "KitchenUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChefCompanyDetails" ADD CONSTRAINT "ChefCompanyDetails_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChefCompanyDetails" ADD CONSTRAINT "ChefCompanyDetails_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChefCompanyDetails" ADD CONSTRAINT "ChefCompanyDetails_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChefCompanyDetails" ADD CONSTRAINT "ChefCompanyDetails_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "ChefUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitchenReviews" ADD CONSTRAINT "KitchenReviews_kitchenDetailsId_fkey" FOREIGN KEY ("kitchenDetailsId") REFERENCES "KitchenDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitchenReviews" ADD CONSTRAINT "KitchenReviews_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "ChefCompanyDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChefReviews" ADD CONSTRAINT "ChefReviews_chefDetailsId_fkey" FOREIGN KEY ("chefDetailsId") REFERENCES "ChefCompanyDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_chefDetailsId_fkey" FOREIGN KEY ("chefDetailsId") REFERENCES "ChefUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_chefDetailsId_fkey" FOREIGN KEY ("chefDetailsId") REFERENCES "ChefCompanyDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "ChefCompanyDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_kitchenDetailsId_fkey" FOREIGN KEY ("kitchenDetailsId") REFERENCES "KitchenDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoughtCredits" ADD CONSTRAINT "BoughtCredits_creditPackageId_fkey" FOREIGN KEY ("creditPackageId") REFERENCES "CreditPackages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoughtCredits" ADD CONSTRAINT "BoughtCredits_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "ChefUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoughtCredits" ADD CONSTRAINT "BoughtCredits_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_chefId_fkey" FOREIGN KEY ("chefId") REFERENCES "ChefUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
