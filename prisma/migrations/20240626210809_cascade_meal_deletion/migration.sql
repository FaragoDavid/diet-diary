-- DropForeignKey
ALTER TABLE "dishes" DROP CONSTRAINT "dishes_meal_date_meal_type_fkey";

-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_day_date_fkey";

-- AddForeignKey
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_meal_date_meal_type_fkey" FOREIGN KEY ("meal_date", "meal_type") REFERENCES "meals"("date", "type") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_day_date_fkey" FOREIGN KEY ("day_date") REFERENCES "days"("date") ON DELETE CASCADE ON UPDATE CASCADE;
