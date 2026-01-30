/*
  Warnings:

  - You are about to drop the column `calories` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the column `carbs` on the `meals` table. All the data in the column will be lost.
  - You are about to drop the column `fat` on the `meals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "meals" DROP COLUMN "calories",
DROP COLUMN "carbs",
DROP COLUMN "fat";
