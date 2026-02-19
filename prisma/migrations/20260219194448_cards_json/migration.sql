/*
  Warnings:

  - The `generatedCards` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "generatedCards" JSONB[];

-- AlterTable
ALTER TABLE "users" DROP COLUMN "generatedCards",
ADD COLUMN     "generatedCards" JSONB[];
