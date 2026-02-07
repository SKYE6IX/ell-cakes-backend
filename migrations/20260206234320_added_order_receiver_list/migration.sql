-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderReceiver" UUID;

-- AlterTable
ALTER TABLE "OrderIntent" ADD COLUMN     "orderReceiver" UUID;

-- CreateTable
CREATE TABLE "OrderReceiver" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "OrderReceiver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderReceiver_key" ON "Order"("orderReceiver");

-- CreateIndex
CREATE INDEX "OrderIntent_orderReceiver_idx" ON "OrderIntent"("orderReceiver");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderReceiver_fkey" FOREIGN KEY ("orderReceiver") REFERENCES "OrderReceiver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderIntent" ADD CONSTRAINT "OrderIntent_orderReceiver_fkey" FOREIGN KEY ("orderReceiver") REFERENCES "OrderReceiver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

