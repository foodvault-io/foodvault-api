-- AlterTable
ALTER TABLE "KitchenDetails" ADD COLUMN     "totalCreditsReceived" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "KitchenUser" ADD COLUMN     "accountCredits" INTEGER NOT NULL DEFAULT 0;
