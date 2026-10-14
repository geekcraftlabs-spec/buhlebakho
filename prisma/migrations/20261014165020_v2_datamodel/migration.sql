/*
  Warnings:

  - You are about to drop the column `payshapReference` on the `Order` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "payshapReference",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "orderDay" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "smsNumber" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "yocoCheckoutId" TEXT,
ADD COLUMN     "yocoPaymentId" TEXT,
ALTER COLUMN "deliveryMethod" SET DEFAULT 'door';

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "hairType" TEXT NOT NULL,
    "laceType" TEXT NOT NULL,
    "texture" TEXT NOT NULL,
    "colorCode" TEXT NOT NULL,
    "colorName" TEXT NOT NULL,
    "sizeGroup" TEXT,
    "futuraSize" TEXT,
    "sizeLabel" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "salePrice" INTEGER,
    "stockCount" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "slotCount" INTEGER,
    "slotPeriodStart" TIMESTAMP(3),
    "slotPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "variantSnapshot" JSONB NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryLogEntry" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "beforeValue" TEXT,
    "afterValue" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryLogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "ProductVariant_hairType_idx" ON "ProductVariant"("hairType");

-- CreateIndex
CREATE INDEX "ProductVariant_isFeatured_idx" ON "ProductVariant"("isFeatured");

-- CreateIndex
CREATE INDEX "ProductVariant_isHidden_idx" ON "ProductVariant"("isHidden");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_hairType_laceType_texture_colorCode_sizeLabe_key" ON "ProductVariant"("hairType", "laceType", "texture", "colorCode", "sizeLabel");

-- CreateIndex
CREATE INDEX "WaitlistEntry_variantId_idx" ON "WaitlistEntry"("variantId");

-- CreateIndex
CREATE INDEX "WaitlistEntry_notified_idx" ON "WaitlistEntry"("notified");

-- CreateIndex
CREATE INDEX "InventoryLogEntry_variantId_idx" ON "InventoryLogEntry"("variantId");

-- CreateIndex
CREATE INDEX "InventoryLogEntry_createdAt_idx" ON "InventoryLogEntry"("createdAt");

-- CreateIndex
CREATE INDEX "Order_orderDay_idx" ON "Order"("orderDay");

-- CreateIndex
CREATE INDEX "Order_paidAt_idx" ON "Order"("paidAt");

-- AddForeignKey
ALTER TABLE "WaitlistEntry" ADD CONSTRAINT "WaitlistEntry_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLogEntry" ADD CONSTRAINT "InventoryLogEntry_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
