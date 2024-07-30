/*
  Warnings:

  - You are about to drop the column `count` on the `Stock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "count",
ADD COLUMN     "amount" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stock_productId_key" ON "Stock"("productId");
