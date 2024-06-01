/*
  Warnings:

  - The primary key for the `recipe_ingredients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `recipe_ingredients` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recipe_id,ingredient_id]` on the table `recipe_ingredients` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "recipe_ingredients" DROP CONSTRAINT "recipe_ingredients_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "recipe_ingredients_recipe_id_ingredient_id_key" ON "recipe_ingredients"("recipe_id", "ingredient_id");
