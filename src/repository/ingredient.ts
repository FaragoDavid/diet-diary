import { Prisma } from '@prisma/client';

import prisma from '../utils/prisma-client';

export type Ingredient = {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  fat: number;
};

export async function fetchIngredients(query: string = '') {
  return prisma.ingredient.findMany({ where: { name: { contains: query } }, orderBy: { name: 'asc' } });
}

export async function fetchIngredient(id: string) {
  return prisma.ingredient.findUnique({ where: { id } });
}

export async function insertIngredient(name: string) {
  return await prisma.ingredient.create({ data: { name } });
}

export async function deleteIngredient(id: string): Promise<void> {
  await prisma.ingredient.delete({ where: { id } });
}

export async function updateIngredient(id: string, data: Prisma.IngredientUpdateInput): Promise<void> {
  const nutritionFieldsChanged = data.caloriesPer100 !== undefined || data.carbsPer100 !== undefined || data.fatPer100 !== undefined;

  await prisma.ingredient.update({ where: { id }, data });

  if (nutritionFieldsChanged) {
    const updatedIngredient = await prisma.ingredient.findUnique({ where: { id } });
    if (!updatedIngredient) return;

    const recipesWithIngredient = await prisma.recipe.findMany({
      where: {
        ingredients: {
          some: { ingredientId: id },
        },
      },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
      },
    });

    for (const recipe of recipesWithIngredient) {
      let totalCalories = 0;
      let totalCarbs = 0;
      let totalFat = 0;

      for (const recipeIngredient of recipe.ingredients) {
        const amount = recipeIngredient.amount / 100;
        totalCalories += recipeIngredient.ingredient.caloriesPer100 * amount;
        totalCarbs += recipeIngredient.ingredient.carbsPer100 * amount;
        totalFat += recipeIngredient.ingredient.fatPer100 * amount;
      }

      await prisma.recipe.update({
        where: { id: recipe.id },
        data: {
          calories: totalCalories,
          carbs: totalCarbs,
          fat: totalFat,
        },
      });
    }
  }
}
