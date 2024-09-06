import prisma from '../utils/prisma-client';

export async function fetchRecipes(query: string = '') {
  return await prisma.recipe.findMany({
    where: { name: { contains: query } },
    select: {
      id: true,
      name: true,
      amount: true,
      servings: true,
      calories: true,
      carbs: true,
      fat: true,
      ingredients: {
        select: { amount: true, ingredient: true },
      },
    },
    orderBy: { name: 'asc' },
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
      calories: true,
      carbs: true,
      fat: true,
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
      calories: true,
      carbs: true,
      fat: true,
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
