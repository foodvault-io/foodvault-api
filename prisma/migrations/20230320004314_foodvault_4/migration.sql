/*
  Warnings:

  - You are about to drop the column `kitchenDetailsId` on the `ChefReviews` table. All the data in the column will be lost.
  - Added the required column `kitchenUserId` to the `ChefReviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChefReviews" DROP COLUMN "kitchenDetailsId",
ADD COLUMN     "kitchenUserId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ChefReviews" ADD CONSTRAINT "ChefReviews_kitchenUserId_fkey" FOREIGN KEY ("kitchenUserId") REFERENCES "KitchenUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
