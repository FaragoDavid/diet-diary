import prisma from '../utils/prisma-client';

export async function fetchRecipes(query: string = '') {
  return await prisma.recipe.findMany({
    where: { name: { contains: query } },
    select: {
      id: true,
      name: true,
      amount: true,
      servings: true,
      ingredients: {
        select: { amount: true, ingredient: true },
      },
    },
  });
}

export type RecipeWithIngredients = NonNullable<Awaited<ReturnType<typeof fetchRecipe>>>;
export async function fetchRecipe(id: string) {
  return await prisma.recipe.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      amount: true,
      servings: true,
      ingredients: {
        select: { amount: true, ingredient: true },
      },
    },
  });
}

export async function createRecipe(name: string) {
  return await prisma.recipe.create({
    data: { name },
    select: {
      id: true,
      name: true,
      amount: true,
      servings: true,
      ingredients: {
        select: { amount: true, ingredient: true },
      },
    },
  });
}

export async function deleteRecipe(id: string) {
  await prisma.recipe.delete({ where: { id } });
}

export async function updateRecipeAmount(recipeId: string, amount: number) {
  await prisma.recipe.update({ where: { id: recipeId }, data: { amount } });
}

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
