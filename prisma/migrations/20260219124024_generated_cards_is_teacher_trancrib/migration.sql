/*
  Warnings:

  - You are about to drop the column `learned_words` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_fkey";

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "learned_words",
ADD COLUMN     "transcribation" TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "generatedCards" TEXT[],
ADD COLUMN     "isTeacher" BOOLEAN DEFAULT false;

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "verification_tokens";
