/*
  Warnings:

  - Made the column `servings` on table `recipes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "recipes" ALTER COLUMN "servings" SET NOT NULL,
ALTER COLUMN "servings" SET DEFAULT 1;
