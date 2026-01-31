-- DropForeignKey
ALTER TABLE "CustomizationOption" DROP CONSTRAINT "CustomizationOption_product_fkey";

-- DropIndex
DROP INDEX "CustomizationOption_product_idx";

-- AlterTable
ALTER TABLE "CustomizationOption" DROP COLUMN "product";

-- CreateTable
CREATE TABLE "_CustomizationOption_product" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CustomizationOption_product_AB_unique" ON "_CustomizationOption_product"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomizationOption_product_B_index" ON "_CustomizationOption_product"("B");

-- AddForeignKey
ALTER TABLE "_CustomizationOption_product" ADD CONSTRAINT "_CustomizationOption_product_A_fkey" FOREIGN KEY ("A") REFERENCES "CustomizationOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomizationOption_product" ADD CONSTRAINT "_CustomizationOption_product_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

