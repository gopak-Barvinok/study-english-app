/*
  Warnings:

  - You are about to drop the column `isTeacher` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isTeacher",
ADD COLUMN     "role" TEXT;
