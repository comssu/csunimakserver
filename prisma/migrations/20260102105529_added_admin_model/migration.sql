/*
  Warnings:

  - You are about to drop the column `isVerified` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Student` table. All the data in the column will be lost.
  - Made the column `password` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "isVerified",
DROP COLUMN "refreshToken",
DROP COLUMN "role",
ALTER COLUMN "password" SET NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT 'adminadmin',
    "refreshToken" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
