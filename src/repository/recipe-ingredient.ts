import prisma from '../utils/prisma-client';
import { fetchRecipe } from './recipe';

export async function addIngredient(
  recipeId: string,
  ingredientId: string,
  amount: number,
  nutritionDelta: { calories: number; carbs: number; fat: number },
) {
  const ingredient = await prisma.ingredient.findUnique({ where: { id: ingredientId } });
  if (!ingredient) {
    throw new Error(`Ingredient with id ${ingredientId} does not exist`);
  }
  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) {
    throw new Error(`Recipe with id ${recipeId} does not exist`);
  }

  const existingRecipeIngredient = await prisma.recipeIngredient.findUnique({
    where: { recipeId_ingredientId: { recipeId, ingredientId } },
    include: { ingredient: true },
  });

  if (existingRecipeIngredient) {
    const newAmount = existingRecipeIngredient.amount + amount;

    await prisma.$transaction([
      prisma.recipeIngredient.update({
        where: { recipeId_ingredientId: { recipeId, ingredientId } },
        data: { amount: newAmount },
      }),
      prisma.recipe.update({
        where: { id: recipeId },
        data: {
          calories: { increment: nutritionDelta.calories },
          carbs: { increment: nutritionDelta.carbs },
          fat: { increment: nutritionDelta.fat },
        },
      }),
    ]);

    return { amount: newAmount, ingredient: existingRecipeIngredient.ingredient };
  }

  const [recipeIngredient] = await prisma.$transaction([
    prisma.recipeIngredient.create({
      data: { recipeId, ingredientId, amount },
      select: { amount: true, ingredient: true },
    }),
    prisma.recipe.update({
      where: { id: recipeId },
      data: {
        calories: { increment: nutritionDelta.calories },
        carbs: { increment: nutritionDelta.carbs },
        fat: { increment: nutritionDelta.fat },
      },
    }),
  ]);

  return recipeIngredient;
}

export async function updateIngredientAmount(
  recipeId: string,
  ingredientId: string,
  amount: number,
  nutritionDelta: { calories: number; carbs: number; fat: number },
) {
  const ingredient = await prisma.recipeIngredient.findUnique({
    where: { recipeId_ingredientId: { recipeId, ingredientId } },
    include: { ingredient: true },
  });
  if (!ingredient) {
    throw new Error(`Ingredient with id ${ingredientId} not found in recipe with id ${recipeId}`);
  }

  await prisma.$transaction([
    prisma.recipeIngredient.update({ where: { recipeId_ingredientId: { recipeId, ingredientId } }, data: { amount } }),
    prisma.recipe.update({
      where: { id: recipeId },
      data: {
        calories: { increment: nutritionDelta.calories },
        carbs: { increment: nutritionDelta.carbs },
        fat: { increment: nutritionDelta.fat },
      },
    }),
  ]);

  return await fetchRecipe(recipeId);
}

export async function deleteRecipeIngredient(
  recipeId: string,
  ingredientId: string,
  nutritionDelta: { calories: number; carbs: number; fat: number },
) {
  const removedRecipeIngredient = await prisma.recipeIngredient.findUnique({
    where: { recipeId_ingredientId: { recipeId, ingredientId } },
    include: { ingredient: true },
  });
  if (!removedRecipeIngredient) {
    throw new Error(`Ingredient with id ${ingredientId} not found in recipe with id ${recipeId}`);
  }

  await prisma.$transaction([
    prisma.recipeIngredient.delete({ where: { recipeId_ingredientId: { recipeId, ingredientId } } }),
    prisma.recipe.update({
      where: { id: recipeId },
      data: {
        calories: { increment: nutritionDelta.calories },
        carbs: { increment: nutritionDelta.carbs },
        fat: { increment: nutritionDelta.fat },
      },
    }),
  ]);

  return await fetchRecipe(recipeId);
}
