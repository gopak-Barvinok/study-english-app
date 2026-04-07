/*
  Warnings:

  - You are about to drop the column `scanUrl` on the `Certificate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "scanUrl",
ADD COLUMN     "scan" TEXT;
