import { FastifyReply, FastifyRequest } from 'fastify';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';

import { dayMealDishList } from '../../components/meals/day-meal-dish-list';
import { MealType } from '../../config';
import { paramToDate } from '../../utils/converters';
import * as mealRepository from '../../repository/meal';
import * as recipeRepository from '../../repository/recipe';
import * as ingredientRepository from '../../repository/ingredient';
import prisma from '../../utils/prisma-client';

type CreateCookingVersionRequest = FastifyRequest<{
  Params: { date: string; mealType: MealType; dishId: string };
}>;

export default async (request: CreateCookingVersionRequest, reply: FastifyReply) => {
  const { mealType, dishId } = request.params;
  const date = paramToDate(request.params.date);

  const dish = await prisma.dish.findUnique({ where: { id: dishId } });
  if (!dish || !dish.recipeId) {
    return { error: 'Dish not found or not a recipe dish' };
  }

  const baseRecipe = await recipeRepository.fetchRecipe(dish.recipeId);
  if (!baseRecipe) {
    return { error: 'Base recipe not found' };
  }

  const versionName = `${baseRecipe.name} (${format(date, 'MMM d, yyyy', { locale: hu })})`;
  const version = await recipeRepository.createRecipeVersion(dish.recipeId, versionName);

  if (!version) {
    return { error: 'Failed to create cooking version' };
  }

  await prisma.dish.update({
    where: { id: dishId },
    data: {
      recipeId: version.id,
      name: version.name,
    },
  });

  const meal = await mealRepository.fetchMeal(date, mealType);
  if (!meal) {
    return { error: 'Meal not found' };
  }

  const [ingredients, recipes] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipes()]);

  const template = await dayMealDishList(meal, date, ingredients, recipes, { swapOob: false });
  return template;
};
