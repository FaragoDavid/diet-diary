import prisma from '../utils/prisma-client';
import { fetchRecipe } from './recipe';

export async function addIngredient(recipeId: string, ingredientId: string, amount: number) {
  return await prisma.recipeIngredient.create({
    data: { recipeId, ingredientId, amount },
    select: { amount: true, ingredient: true },
  });
}

export async function updateIngredientAmount(recipeId: string, ingredientId: string, amount: number) {
  await prisma.recipeIngredient.update({ where: { recipeId_ingredientId: { recipeId, ingredientId } }, data: { amount } });

  return await fetchRecipe(recipeId);
}

export async function deleteRecipeIngredient(recipeId: string, ingredientId: string) {
  await prisma.recipeIngredient.delete({ where: { recipeId_ingredientId: { recipeId, ingredientId } } });

  return await fetchRecipe(recipeId);
}
