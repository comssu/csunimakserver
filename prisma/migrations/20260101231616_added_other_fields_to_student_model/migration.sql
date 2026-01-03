/*
  Warnings:

  - Added the required column `level` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Made the column `profileUrl` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profileId` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "about" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "linkedIn" TEXT,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "isVerified" SET DEFAULT false,
ALTER COLUMN "profileUrl" SET NOT NULL,
ALTER COLUMN "profileId" SET NOT NULL;
