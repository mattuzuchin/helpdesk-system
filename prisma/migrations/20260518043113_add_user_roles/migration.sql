/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `closeDate` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `openDate` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "assignedTo",
DROP COLUMN "closeDate",
DROP COLUMN "createdBy",
DROP COLUMN "openDate",
ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "createdById" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tokenVersion" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
