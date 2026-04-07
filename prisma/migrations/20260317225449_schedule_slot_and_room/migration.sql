/*
  Warnings:

  - You are about to drop the column `created_at` on the `rooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "scheduleSlot" ADD COLUMN     "roomId" TEXT;

-- AddForeignKey
ALTER TABLE "scheduleSlot" ADD CONSTRAINT "scheduleSlot_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("room_id") ON DELETE SET NULL ON UPDATE CASCADE;
