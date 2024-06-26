-- AlterTable
ALTER TABLE "dishes" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "calories" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "carbs" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "fat" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ingredients" ALTER COLUMN "calories_per_100" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "carbs_per_100" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "fat_per_100" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "meals" ALTER COLUMN "calories" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "carbs" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "fat" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "recipe_ingredients" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "recipes" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;
