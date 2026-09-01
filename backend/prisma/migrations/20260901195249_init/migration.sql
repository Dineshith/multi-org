/*
  Warnings:

  - You are about to drop the column `image` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `disciplineId` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the `Discipline` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `Faculty` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_disciplineId_fkey";

-- AlterTable
ALTER TABLE "Faculty" DROP COLUMN "image",
ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "disciplineId",
ADD COLUMN     "facultyMembersId" TEXT;

-- DropTable
DROP TABLE "Discipline";

-- CreateTable
CREATE TABLE "FacultyMembers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FacultyMembers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_organizationId_key" ON "Faculty"("organizationId");

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_facultyMembersId_fkey" FOREIGN KEY ("facultyMembersId") REFERENCES "FacultyMembers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
