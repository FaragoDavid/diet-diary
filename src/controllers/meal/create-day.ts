import { FastifyReply, FastifyRequest } from 'fastify';

import { dayHeader } from '../../components/meals/day-header';
import { dayMealList } from '../../components/meals/day-meal-list';
import { dayStats } from '../../components/meals/day-stats';
import { missingMeals } from '../../components/meals/missing-meals';
import * as ingredientRepository from '../../repository/ingredient';
import * as mealRepository from '../../repository/meal';
import * as recipeRepository from '../../repository/recipe';

type DashDate = `${string}-${string}-${string}`;
type CreateDayRequest = FastifyRequest<{ Body: { date: DashDate } }>;

export default async (request: CreateDayRequest, reply: FastifyReply) => {
  const { date } = request.body;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Invalid date format. Expected YYYY-MM-DD</div>');
  }

  const bodyDate = new Date(date);

  if (isNaN(bodyDate.getTime())) {
    return reply.status(400).type('text/html').send('<div class="alert alert-error">Invalid date value</div>');
  }

  const day = await mealRepository.createDay(bodyDate);
  const [ingredients, recipes] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipes()]);

  const template = `
    ${dayHeader(day)}
    ${await dayStats(day, { layout: 'vertical', span: 'col-span-5', swapOob: false })}
    ${await missingMeals(day, { swapOob: false })}
    ${await dayMealList(day, ingredients, recipes, { layout: 'page', swapOob: false })}
  `;

  const dateParam = request.body.date.split('-').join('');
  return { template, url: `/day/${dateParam}` };
};
