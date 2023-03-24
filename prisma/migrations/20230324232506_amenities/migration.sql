-- AlterTable
ALTER TABLE "KitchenAmenities" ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "iconImage" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ChefEquipment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "chefCompanyId" TEXT NOT NULL,

    CONSTRAINT "ChefEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChefAmenities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iconImage" TEXT,
    "status" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ChefAmenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChefAmenitiesToChefEquipment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ChefEquipment_chefCompanyId_key" ON "ChefEquipment"("chefCompanyId");

-- CreateIndex
CREATE UNIQUE INDEX "_ChefAmenitiesToChefEquipment_AB_unique" ON "_ChefAmenitiesToChefEquipment"("A", "B");

-- CreateIndex
CREATE INDEX "_ChefAmenitiesToChefEquipment_B_index" ON "_ChefAmenitiesToChefEquipment"("B");

-- AddForeignKey
ALTER TABLE "ChefEquipment" ADD CONSTRAINT "ChefEquipment_chefCompanyId_fkey" FOREIGN KEY ("chefCompanyId") REFERENCES "ChefCompanyDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChefAmenitiesToChefEquipment" ADD CONSTRAINT "_ChefAmenitiesToChefEquipment_A_fkey" FOREIGN KEY ("A") REFERENCES "ChefAmenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChefAmenitiesToChefEquipment" ADD CONSTRAINT "_ChefAmenitiesToChefEquipment_B_fkey" FOREIGN KEY ("B") REFERENCES "ChefEquipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
