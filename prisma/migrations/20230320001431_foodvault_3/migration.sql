/*
  Warnings:

  - You are about to drop the column `identificationUrl` on the `ChefUser` table. All the data in the column will be lost.
  - You are about to drop the column `identificationUrl` on the `KitchenDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChefUser" DROP COLUMN "identificationUrl";

-- AlterTable
ALTER TABLE "KitchenDetails" DROP COLUMN "identificationUrl",
ALTER COLUMN "additionalEquipment" DROP NOT NULL;
