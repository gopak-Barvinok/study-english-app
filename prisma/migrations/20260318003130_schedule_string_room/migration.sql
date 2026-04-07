/*
  Warnings:

  - You are about to drop the column `roomId` on the `scheduleSlot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "scheduleSlot" DROP CONSTRAINT "scheduleSlot_roomId_fkey";

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "slot" TEXT;

-- AlterTable
ALTER TABLE "scheduleSlot" DROP COLUMN "roomId";
