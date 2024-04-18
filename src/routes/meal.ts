import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../components/layout.js';
import { dayHeader } from '../components/meals/day-header.js';
import { DayStats } from '../components/meals/day-stats.js';
import { Days } from '../components/meals/days.js';
import { DishComponent } from '../components/meals/dish.js';
import { MealStats } from '../components/meals/meal-stats.js';
import { MealComponent } from '../components/meals/meal.js';
import { MissingMeals } from '../components/meals/missing-meals.js';
import { MealType } from '../config.js';
import { DayPage, NewDayPage } from '../pages/day.js';
import { fetchIngredients } from '../repository/ingredient.js';
import * as mealRepository from '../repository/meal.js';
import { fetchDayMeals } from '../repository/meal.js';

type DashDate = `${string}-${string}-${string}`;
function convertDateParam(date: string): Date {
  return new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`);
}

type GetMealsRequest = FastifyRequest<{ Querystring: { fromDate: number; toDate: number } }>;
type CreateDayRequest = FastifyRequest<{ Body: { date: DashDate } }>;
type EditDayRequest = FastifyRequest<{ Params: { date: string } }>;
type GetDayRequest = FastifyRequest<{ Params: { date: string } }>;
type AddMealRequest = FastifyRequest<{ Params: { date: string }; Body: { mealType: MealType } }>;
type AddDishRequest = FastifyRequest<{
  Params: { date: string; mealType: MealType };
  Body: { dishId: string; amount: number };
}>;

export const getDays = async (request: GetMealsRequest, reply: FastifyReply) => {
  const fromDate = new Date(request.query.fromDate);
  const toDate = new Date(request.query.toDate);

  const days = await fetchDayMeals(fromDate, toDate);
  const ingredients = await fetchIngredients();

  const template = await new Days(days, ingredients).render();
  return reply.type('text/html').send(template);
};

export const getDay = async (request: GetDayRequest, reply: FastifyReply) => {
  const { date } = request.params;
  const day = await mealRepository.fetchDay(convertDateParam(date));
  const ingredients = await fetchIngredients();

  const template = await layout(new DayPage(day, ingredients));

  return reply.type('text/html').send(template);
};

export const newDay = async (_: FastifyRequest, reply: FastifyReply) => {
  const template = await layout(new NewDayPage());

  return reply.type('text/html').send(template);
};

export const createDay = async (request: CreateDayRequest, reply: FastifyReply) => {
  const bodyDate = new Date(request.body.date);
  const day = await mealRepository.createDay(bodyDate);

  const template = `${dayHeader(day)}
      ${await new DayStats(day, DayStats.SPAN.FIVE).render()}
      ${await new MissingMeals(day).render()}`;

  const dateParam = request.body.date.split('-').join('');
  return reply.type('text/html').header('HX-Push-Url', `/day/${dateParam}`).send(template);
};

export const editDay = async (request: EditDayRequest, reply: FastifyReply) => {
  const { date } = request.params;
  const day = await mealRepository.fetchDay(convertDateParam(date));
  const ingredients = await fetchIngredients();

  const template = await new DayPage(day, ingredients).render();

  return reply.type('text/html').send(template);
};

export const addMeal = async (request: AddMealRequest, reply: FastifyReply) => {
  const date = convertDateParam(request.params.date);

  const meal = await mealRepository.addMeal(date, request.body.mealType);
  const day = await mealRepository.fetchDay(date);
  const ingredients = await fetchIngredients();

  const template = `
    ${await new MissingMeals(day, true).render()}
    ${await new MealComponent({ ...meal, date }, ingredients, {
      statsSpan: MealComponent.STATS_SPAN.FOUR,
      isFirst: day.meals.length === 1,
      showDishes: true,
    }).render()}
  `;

  return reply.type('text/html').send(template);
};

export const addDish = async (request: AddDishRequest, reply: FastifyReply) => {
  const { date, mealType } = request.params;

  const dish = await mealRepository.addDish(
    convertDateParam(date),
    mealType,
    request.body[`${mealType}-dishId`],
    Number(request.body.amount),
  );
  const day = await mealRepository.fetchDay(convertDateParam(date));
  const meal = await mealRepository.fetchMeal(convertDateParam(date), mealType);
  const template = `
    ${await new DishComponent(dish).render()}
    ${await new MealStats(meal, MealStats.SPAN.FOUR, true).render()}
    ${await new DayStats(day, DayStats.SPAN.FIVE, true).render()}
  `;

  return reply.type('text/html').send(template);
};
