/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeneratedCard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- DropForeignKey
ALTER TABLE "GeneratedCard" DROP CONSTRAINT "GeneratedCard_roomId_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "GeneratedCard";

-- CreateTable
CREATE TABLE "generatedCard" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "front" TEXT,
    "back" TEXT,
    "example" TEXT,
    "translation" TEXT,
    "type" TEXT,

    CONSTRAINT "generatedCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduleSlot" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "hour" TEXT NOT NULL,

    CONSTRAINT "scheduleSlot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "generatedCard" ADD CONSTRAINT "generatedCard_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduleSlot" ADD CONSTRAINT "scheduleSlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
