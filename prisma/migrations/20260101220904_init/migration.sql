-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STUDENT');

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "profileUrl" TEXT,
    "profileId" TEXT,
    "role" "Role" NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);
