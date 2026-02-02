-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryOption" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "OrderIntent" ADD COLUMN     "deliveryOption" TEXT NOT NULL DEFAULT '';

