import prisma from '../utils/prisma-client';
import { fetchRecipe } from './recipe';

export async function addIngredient(recipeId: string, ingredientId: string, amount: number) {
  const ingredient = await prisma.ingredient.findUnique({ where: { id: ingredientId } });
  if (!ingredient) {
    throw new Error(`Ingredient with id ${ingredientId} does not exist`);
  }
  const { caloriesPer100, carbsPer100, fatPer100 } = ingredient;
  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) {
    throw new Error(`Recipe with id ${recipeId} does not exist`);
  }

  const [recipeIngredient] = await prisma.$transaction([
    prisma.recipeIngredient.create({
      data: { recipeId, ingredientId, amount },
      select: { amount: true, ingredient: true },
    }),
    prisma.recipe.update({
      where: { id: recipeId },
      data: {
        calories: { increment: (caloriesPer100 / 100) * amount },
        carbs: { increment: (carbsPer100 / 100) * amount },
        fat: { increment: (fatPer100 / 100) * amount },
      },
    }),
  ]);

  return recipeIngredient;
}

export async function updateIngredientAmount(recipeId: string, ingredientId: string, amount: number) {
  const ingredient = await prisma.recipeIngredient.findUnique({
    where: { recipeId_ingredientId: { recipeId, ingredientId } },
    include: { ingredient: true },
  });
  if (!ingredient) {
    throw new Error(`Ingredient with id ${ingredientId} not found in recipe with id ${recipeId}`);
  }
  const { caloriesPer100, carbsPer100, fatPer100 } = ingredient.ingredient;

  await prisma.$transaction([
    prisma.recipeIngredient.update({ where: { recipeId_ingredientId: { recipeId, ingredientId } }, data: { amount } }),
    prisma.recipe.update({
      where: { id: recipeId },
      data: {
        calories: { increment: (caloriesPer100 / 100) * amount },
        carbs: { increment: (carbsPer100 / 100) * amount },
        fat: { increment: (fatPer100 / 100) * amount },
      },
    }),
  ]);

  return await fetchRecipe(recipeId);
}

export async function deleteRecipeIngredient(recipeId: string, ingredientId: string) {
  const removedRecipeIngredient = await prisma.recipeIngredient.findUnique({
    where: { recipeId_ingredientId: { recipeId, ingredientId } },
    include: { ingredient: true },
  });
  if (!removedRecipeIngredient) {
    throw new Error(`Ingredient with id ${ingredientId} not found in recipe with id ${recipeId}`);
  }

  const {
    amount,
    ingredient: { caloriesPer100, carbsPer100, fatPer100 },
  } = removedRecipeIngredient;

  await prisma.$transaction([
    prisma.recipeIngredient.delete({ where: { recipeId_ingredientId: { recipeId, ingredientId } } }),
    prisma.recipe.update({
      where: { id: recipeId },
      data: {
        calories: { decrement: (caloriesPer100 / 100) * amount },
        carbs: { decrement: (carbsPer100 / 100) * amount },
        fat: { decrement: (fatPer100 / 100) * amount },
      },
    }),
  ]);

  return await fetchRecipe(recipeId);
}
