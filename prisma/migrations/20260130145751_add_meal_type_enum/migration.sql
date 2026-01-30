/*
  Warnings:

  - Changed the type of `meal_type` on the `dishes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `meals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('morningSnack', 'breakfast', 'brunch', 'lunch', 'afternoonSnack', 'dinner', 'lateNightSnack');

-- DropForeignKey
ALTER TABLE "dishes" DROP CONSTRAINT "dishes_meal_date_meal_type_fkey";

-- AlterTable
ALTER TABLE "dishes" DROP COLUMN "meal_type",
ADD COLUMN     "meal_type" "MealType" NOT NULL;

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "type",
ADD COLUMN     "type" "MealType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "meals_date_type_key" ON "meals"("date", "type");

-- AddForeignKey
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_meal_date_meal_type_fkey" FOREIGN KEY ("meal_date", "meal_type") REFERENCES "meals"("date", "type") ON DELETE CASCADE ON UPDATE CASCADE;
