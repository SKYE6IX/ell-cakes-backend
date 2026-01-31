-- AlterTable
ALTER TABLE "CustomizationOption" ADD COLUMN     "slug" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "CustomizationOption_slug_key" ON "CustomizationOption"("slug");

