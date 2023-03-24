/*
  Warnings:

  - You are about to drop the column `verified` on the `Certificates` table. All the data in the column will be lost.
  - You are about to drop the column `required` on the `KitchenAmenities` table. All the data in the column will be lost.
  - You are about to drop the column `timeSlotEndDate` on the `TimeSlot` table. All the data in the column will be lost.
  - Changed the type of `status` on the `City` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Country` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `status` to the `KitchenAmenities` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `State` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Certificates" DROP COLUMN "verified";

-- AlterTable
ALTER TABLE "City" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Country" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "KitchenAmenities" DROP COLUMN "required",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "State" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TimeSlot" DROP COLUMN "timeSlotEndDate";

-- DropEnum
DROP TYPE "LocationStatus";
