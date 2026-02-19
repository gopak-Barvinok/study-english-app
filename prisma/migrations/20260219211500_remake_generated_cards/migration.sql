/*
  Warnings:

  - You are about to drop the column `generatedCards` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `roomIds` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "generatedCards";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "roomIds";
