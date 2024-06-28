import { FastifyReply, FastifyRequest } from 'fastify';

import { dayHeader } from '../../components/meals/day-header';
import { DayMealList } from '../../components/meals/day-meal-list';
import { DayStats } from '../../components/meals/day-stats';
import { MissingMeals } from '../../components/meals/missing-meals';
import { fetchIngredients } from '../../repository/ingredient';
import { createDay } from '../../repository/meal';
import { fetchRecipes } from '../../repository/recipe';

type DashDate = `${string}-${string}-${string}`;
type CreateDayRequest = FastifyRequest<{ Body: { date: DashDate } }>;

export default async (request: CreateDayRequest, reply: FastifyReply) => {
  const bodyDate = new Date(request.body.date);
  const day = await createDay(bodyDate);
  const ingredients = await fetchIngredients();
  const recipes = await fetchRecipes();

  const template = `
    ${dayHeader(day)}
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: false }).render()}
    ${await new MissingMeals(day, { swapOob: false }).render()}
    ${await new DayMealList(day, ingredients, recipes, { layout: 'page', swapOob: false }).render()}
  `;

  const dateParam = request.body.date.split('-').join('');
  return reply.type('text/html').header('HX-Push-Url', `/day/${dateParam}`).send(template);
};