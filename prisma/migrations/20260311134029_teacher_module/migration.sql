/*
  Warnings:

  - You are about to drop the column `certificateFiles` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `pricePerHour` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "certificateFiles",
ADD COLUMN     "certificateUrls" TEXT[],
ADD COLUMN     "pricePerHour" TEXT NOT NULL,
ADD COLUMN     "writtingAboutYourself" TEXT;

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
