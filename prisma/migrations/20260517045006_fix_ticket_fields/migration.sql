/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "createdAt",
ADD COLUMN     "assignedTo" INTEGER,
ADD COLUMN     "closeDate" TIMESTAMP(3),
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "openDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
