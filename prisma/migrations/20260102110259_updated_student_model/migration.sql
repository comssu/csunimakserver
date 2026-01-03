/*
  Warnings:

  - You are about to drop the column `password` on the `Student` table. All the data in the column will be lost.
  - Made the column `about` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "password",
ALTER COLUMN "about" SET NOT NULL;
