import { FastifyReply, FastifyRequest } from 'fastify';

import { DayMealDish, DayMealDishHeader } from '../../components/meals/day-meal-dish';
import { DayStats } from '../../components/meals/day-stats';
import { MealStats } from '../../components/meals/meal-stats';
import { NewDish } from '../../components/meals/new-dish';
import { MealType } from '../../config';
import { paramToDate } from '../../utils/converters';
import { HTMX_SWAP } from '../../utils/htmx';
import * as mealService from '../../services/meal.service';
import * as ingredientRepository from '../../repository/ingredient';
import * as recipeRepository from '../../repository/recipe';
type AddDishRequest = FastifyRequest<{ Params: { date: string; mealType: MealType }; Body: { dishId: string; amount: number } }>;

export default async (request: AddDishRequest, reply: FastifyReply) => {
  const { date, mealType } = request.params;

  const amount = Number(request.body.amount);
  if (isNaN(amount) || amount <= 0) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Invalid amount. Must be a positive number.</div>');
  }

  const dishId = request.body[`${mealType}-dishId`];
  if (!dishId) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Please select an ingredient or recipe.</div>');
  }

  const { dish, day, meal } = await mealService.addDishToMeal(paramToDate(date), mealType, dishId, amount);
  const [ingredients, recipes] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipes()]);

  const template = `
    ${
      meal.dishes.length === 1
        ? await new DayMealDishHeader(day.date, meal.type as MealType, { swapOob: HTMX_SWAP.BeforeFirstChild }).render()
        : ''
    }
    ${await new NewDish(meal, day.date, ingredients, recipes, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new DayMealDish(dish, day.date, mealType, { swapOob: HTMX_SWAP.BeforeElement }).render()}
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new MealStats(meal, { layout: 'horizontal', swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;

  return reply.type('text/html').send(template);
};
