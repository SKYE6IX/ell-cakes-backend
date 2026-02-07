-- AlterTable
ALTER TABLE "OrderReceiver" ADD COLUMN     "benefactor" UUID;

-- CreateIndex
CREATE INDEX "OrderReceiver_benefactor_idx" ON "OrderReceiver"("benefactor");

-- AddForeignKey
ALTER TABLE "OrderReceiver" ADD CONSTRAINT "OrderReceiver_benefactor_fkey" FOREIGN KEY ("benefactor") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

