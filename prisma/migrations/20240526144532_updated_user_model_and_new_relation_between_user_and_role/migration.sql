/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "RolesOnUsers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "Roles" NOT NULL,

    CONSTRAINT "RolesOnUsers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RolesOnUsers" ADD CONSTRAINT "RolesOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
