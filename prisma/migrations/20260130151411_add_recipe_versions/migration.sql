-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "base_recipe_id" TEXT;

-- AddForeignKey
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_base_recipe_id_fkey" FOREIGN KEY ("base_recipe_id") REFERENCES "recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
