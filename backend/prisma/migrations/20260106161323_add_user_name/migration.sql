/*
  Warnings:

  - Made the column `budget` on table `itineraries` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "itineraries" ALTER COLUMN "budget" SET NOT NULL,
ALTER COLUMN "budget" SET DEFAULT 5000;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT NOT NULL;
