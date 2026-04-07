/*
  Warnings:

  - You are about to drop the column `day` on the `scheduleSlot` table. All the data in the column will be lost.
  - You are about to drop the column `hour` on the `scheduleSlot` table. All the data in the column will be lost.
  - Added the required column `slot` to the `scheduleSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scheduleSlot" DROP COLUMN "day",
DROP COLUMN "hour",
ADD COLUMN     "slot" TEXT NOT NULL;
