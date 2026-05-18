/*
  Warnings:

  - The `closeDate` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `openDate` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "closeDate",
ADD COLUMN     "closeDate" TIMESTAMP(3),
DROP COLUMN "openDate",
ADD COLUMN     "openDate" TIMESTAMP(3);
