/*
  Warnings:

  - The `status` column on the `City` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Country` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `status` on the `KitchenAmenities` table. All the data in the column will be lost.
  - The `status` column on the `State` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "LocationStatus" AS ENUM ('active', 'inactive', 'pending');

-- AlterTable
ALTER TABLE "Certificates" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "City" DROP COLUMN "status",
ADD COLUMN     "status" "LocationStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Country" DROP COLUMN "status",
ADD COLUMN     "status" "LocationStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "KitchenAmenities" DROP COLUMN "status",
ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "State" DROP COLUMN "status",
ADD COLUMN     "status" "LocationStatus" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "TimeSlot" ADD COLUMN     "timeSlotEndDate" TIMESTAMP(3);
