/*
  Warnings:

  - You are about to drop the column `futuraSize` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `sizeGroup` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `slotCount` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `slotPeriodEnd` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `slotPeriodStart` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the `InventoryLogEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InventoryLogEntry" DROP CONSTRAINT "InventoryLogEntry_variantId_fkey";

-- DropForeignKey
ALTER TABLE "WaitlistEntry" DROP CONSTRAINT "WaitlistEntry_variantId_fkey";

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "futuraSize",
DROP COLUMN "sizeGroup",
DROP COLUMN "slotCount",
DROP COLUMN "slotPeriodEnd",
DROP COLUMN "slotPeriodStart";

-- DropTable
DROP TABLE "InventoryLogEntry";
