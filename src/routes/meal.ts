import { FastifyReply, FastifyRequest } from 'fastify';

import { layout } from '../components/layout.js';
import { dayHeader } from '../components/meals/day-header.js';
import { MealTab } from '../components/meals/meal-tab.js';
import { DayStats } from '../components/meals/day-stats.js';
import { DayList } from '../components/meals/day-list.js';
import { DishComponent } from '../components/meals/dish.js';
import { MealStats } from '../components/meals/meal-stats.js';
import { DayMeal } from '../components/meals/day-meal.js';
import { MissingMeals } from '../components/meals/missing-meals.js';
import { MealType } from '../config.js';
import { DayPage, NewDayPage } from '../pages/day.js';
import { selectIngredients } from '../repository/ingredient.js';
import * as mealRepository from '../repository/meal.js';
import { fetchDays } from '../repository/meal.js';
import { paramToDate } from '../utils/converters.js';
import { TAB_NAME, tabList } from '../components/tab-list.js';
import { subDays } from 'date-fns';

type DashDate = `${string}-${string}-${string}`;

type GetMealsRequest = FastifyRequest<{ Querystring: { fromDate: number; toDate: number } }>;
type CreateDayRequest = FastifyRequest<{ Body: { date: DashDate } }>;
type EditDayRequest = FastifyRequest<{ Params: { date: string } }>;
type GetDayRequest = FastifyRequest<{ Params: { date: string } }>;
type AddMealRequest = FastifyRequest<{ Params: { date: string }; Body: { mealType: MealType } }>;
type AddDishRequest = FastifyRequest<{
  Params: { date: string; mealType: MealType };
  Body: { dishId: string; amount: number };
}>;

export const displayMealsTab = async (_: FastifyRequest, reply: FastifyReply) => {
  const ingredients = await selectIngredients();

  const fromDate = subDays(new Date(), 7);
  const toDate = new Date();
  const days = await fetchDays(fromDate, toDate);

  const template = `
    ${tabList(TAB_NAME.meals, true)}
    ${await new MealTab(days, ingredients).render()}
  `;

  return reply.type('text/html').send(template);
};

export const getDays = async (request: GetMealsRequest, reply: FastifyReply) => {
  const fromDate = new Date(request.query.fromDate);
  const toDate = new Date(request.query.toDate);

  const days = await fetchDays(fromDate, toDate);
  const ingredients = await selectIngredients();

  const template = await new DayList(days, ingredients, { swap: false }).render();
  return reply.type('text/html').send(template);
};

export const getDay = async (request: GetDayRequest, reply: FastifyReply) => {
  const { date } = request.params;
  const day = await mealRepository.selectDay(paramToDate(date));
  const ingredients = await selectIngredients();

  const template = await layout(new DayPage(day, ingredients));

  return reply.type('text/html').send(template);
};

export const newDay = async (_: FastifyRequest, reply: FastifyReply) => {
  const template = await layout(new NewDayPage());

  return reply.type('text/html').send(template);
};

export const createDay = async (request: CreateDayRequest, reply: FastifyReply) => {
  const bodyDate = new Date(request.body.date);
  const day = await mealRepository.insertDay(bodyDate);

  const template = `${dayHeader(day)}
      ${await new DayStats(day, { span: DayStats.SPAN.FIVE, swap: false }).render()}
      ${await new MissingMeals(day).render()}`;

  const dateParam = request.body.date.split('-').join('');
  return reply.type('text/html').header('HX-Push-Url', `/day/${dateParam}`).send(template);
};

export const editDay = async (request: EditDayRequest, reply: FastifyReply) => {
  const { date } = request.params;
  const day = await mealRepository.selectDay(paramToDate(date));
  const ingredients = await selectIngredients();

  const template = await new DayPage(day, ingredients).render();

  return reply.type('text/html').send(template);
};

export const addMeal = async (request: AddMealRequest, reply: FastifyReply) => {
  const date = paramToDate(request.params.date);

  const meal = await mealRepository.insertMeal(date, request.body.mealType);
  const day = await mealRepository.selectDay(date);
  const ingredients = await selectIngredients();

  const template = `
    ${await new MissingMeals(day, true).render()}
    ${await new DayMeal({ ...meal, date }, ingredients, {
      statsSpan: DayMeal.STATS_SPAN.FOUR,
      isFirst: day.meals.length === 1,
      showDishes: true,
    }).render()}
  `;

  return reply.type('text/html').send(template);
};

export const addDish = async (request: AddDishRequest, reply: FastifyReply) => {
  const { date, mealType } = request.params;

  const dish = await mealRepository.insertDish(
    paramToDate(date),
    mealType,
    request.body[`${mealType}-dishId`],
    Number(request.body.amount),
  );
  const day = await mealRepository.selectDay(paramToDate(date));
  const meal = await mealRepository.selectMeal(paramToDate(date), mealType);
  const template = `
    ${await new DishComponent(dish).render()}
    ${await new MealStats(meal, { swap: true }).render()}
    ${await new DayStats(day, { span: DayStats.SPAN.FIVE, swap: true }).render()}
  `;

  return reply.type('text/html').send(template);
};
