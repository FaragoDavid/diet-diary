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

export async function createRecipeVersion(baseRecipeId: string, name: string) {
  const baseRecipe = await prisma.recipe.findUnique({
    where: { id: baseRecipeId },
    include: { ingredients: true },
  });

  if (!baseRecipe) {
    throw new Error('Base recipe not found');
  }

  return await prisma.$transaction(async (tx) => {
    const newRecipe = await tx.recipe.create({
      data: {
        name,
        baseRecipeId,
        amount: baseRecipe.amount,
        servings: baseRecipe.servings,
        calories: baseRecipe.calories,
        carbs: baseRecipe.carbs,
        fat: baseRecipe.fat,
      },
    });

    for (const ingredient of baseRecipe.ingredients) {
      await tx.recipeIngredient.create({
        data: {
          recipeId: newRecipe.id,
          ingredientId: ingredient.ingredientId,
          amount: ingredient.amount,
        },
      });
    }

    return await tx.recipe.findUnique({
      where: { id: newRecipe.id },
      include: {
        ingredients: { include: { ingredient: true } },
        baseRecipe: true,
      },
    });
  });
}
