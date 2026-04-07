/*
  Warnings:

  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Language" DROP CONSTRAINT "Language_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "languages" JSONB[];

-- DropTable
DROP TABLE "Language";
