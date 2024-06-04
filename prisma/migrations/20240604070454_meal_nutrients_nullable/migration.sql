/*
  Warnings:

  - You are about to drop the column `mealDate` on the `dishes` table. All the data in the column will be lost.
  - You are about to drop the column `mealType` on the `dishes` table. All the data in the column will be lost.
  - You are about to drop the column `dayDate` on the `meals` table. All the data in the column will be lost.
  - Added the required column `meal_date` to the `dishes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meal_type` to the `dishes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day_date` to the `meals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dishes" DROP CONSTRAINT "dishes_mealDate_mealType_fkey";

-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_dayDate_fkey";

-- AlterTable
ALTER TABLE "dishes" DROP COLUMN "mealDate",
DROP COLUMN "mealType",
ADD COLUMN     "meal_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "meal_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "dayDate",
ADD COLUMN     "day_date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "calories" DROP NOT NULL,
ALTER COLUMN "carbs" DROP NOT NULL,
ALTER COLUMN "fat" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_meal_date_meal_type_fkey" FOREIGN KEY ("meal_date", "meal_type") REFERENCES "meals"("date", "type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_day_date_fkey" FOREIGN KEY ("day_date") REFERENCES "days"("date") ON DELETE RESTRICT ON UPDATE CASCADE;
