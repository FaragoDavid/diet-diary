import { FastifyReply, FastifyRequest } from 'fastify';

import { subDays } from 'date-fns';
import { layout } from '../components/layout.js';
import { dayHeader } from '../components/meals/day-header.js';
import { DayList } from '../components/meals/day-list.js';
import { DayMealDish, DayMealDishHeader } from '../components/meals/day-meal-dish.js';
import { DayMealList } from '../components/meals/day-meal-list.js';
import { DayMeal } from '../components/meals/day-meal.js';
import { DayStats } from '../components/meals/day-stats.js';
import { MealStats } from '../components/meals/meal-stats.js';
import { MealTab } from '../components/meals/meal-tab.js';
import { MissingMeals } from '../components/meals/missing-meals.js';
import { NewDish } from '../components/meals/new-dish.js';
import { TAB_NAME, tabList } from '../components/tab-list.js';
import { MealType } from '../config.js';
import { DayPage, NewDayPage } from '../pages/day.js';
import { selectIngredients } from '../repository/ingredient.js';
import * as mealRepository from '../repository/meal.js';
import { fetchDays } from '../repository/meal.js';
import { paramToDate } from '../utils/converters.js';
import { HTMX_SWAP } from '../utils/htmx.js';

type DashDate = `${string}-${string}-${string}`;

type CreateDayRequest = FastifyRequest<{ Body: { date: DashDate } }>;
type GetDayRequest = FastifyRequest<{ Params: { date: string } }>;
type EditDayRequest = FastifyRequest<{ Params: { date: string } }>;

type GetMealsRequest = FastifyRequest<{ Querystring: { fromDate: number; toDate: number } }>;
type AddMealRequest = FastifyRequest<{ Params: { date: string }; Body: { mealType: MealType } }>;
type DeleteMealRequest = FastifyRequest<{ Params: { date: string; mealType: MealType } }>;

type AddDishRequest = FastifyRequest<{ Params: { date: string; mealType: MealType }; Body: { dishId: string; amount: number } }>;
type DeleteDishRequest = FastifyRequest<{ Params: { date: string; mealType: MealType; dishId: string } }>;

export const displayMealsTab = async (_: FastifyRequest, reply: FastifyReply) => {
  const ingredients = await selectIngredients();

  const fromDate = subDays(new Date(), 7);
  const toDate = new Date();
  const days = await fetchDays(fromDate, toDate);

  const template = `
    ${tabList(TAB_NAME.meals, { swapOob: HTMX_SWAP.ReplaceElement })}
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
  const day = await mealRepository.fetchDay(paramToDate(date));
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

  const template = `
    ${dayHeader(day)}
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new MissingMeals(day, { swapOob: false }).render()}
  `;

  const dateParam = request.body.date.split('-').join('');
  return reply.type('text/html').header('HX-Push-Url', `/day/${dateParam}`).send(template);
};

export const editDay = async (request: EditDayRequest, reply: FastifyReply) => {
  const { date } = request.params;
  const day = await mealRepository.fetchDay(paramToDate(date));
  const ingredients = await selectIngredients();

  const template = await new DayPage(day, ingredients).render();

  return reply.type('text/html').send(template);
};

export const addMeal = async (request: AddMealRequest, reply: FastifyReply) => {
  const date = paramToDate(request.params.date);

  const meal = await mealRepository.insertMeal(date, request.body.mealType);
  const day = await mealRepository.fetchDay(date);
  const ingredients = await selectIngredients();

  const template = `
    ${await new MissingMeals(day, { swapOob: false }).render()}
    ${await new DayMealList(day.meals, date, ingredients, {
      layout: 'page',
      swapOob:HTMX_SWAP.ReplaceElement,
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
  const day = await mealRepository.fetchDay(paramToDate(date));
  const meal = await mealRepository.fetchMeal(paramToDate(date), mealType);
  const ingredients = await selectIngredients();

  const template = `
    ${meal.dishes.length === 1 ? await new DayMealDishHeader(meal.date, meal.type, { swapOob: HTMX_SWAP.BeforeFirstChild }).render() : ''}
    ${await new NewDish(meal, ingredients, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new DayMealDish(dish, meal.date, mealType, { swapOob: HTMX_SWAP.BeforeElement }).render()}
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new MealStats(meal, { layout: 'horizontal', swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;

  return reply.type('text/html').send(template);
};

export const deleteMeal = async (request: DeleteMealRequest, reply: FastifyReply) => {
  const date = paramToDate(request.params.date);
  const mealType = request.params.mealType;

  await mealRepository.deleteMeal(date, mealType);
  const day = await mealRepository.fetchDay(date);

  const template = `
    ${await new DayStats(day, { layout: 'vertical', span: DayStats.SPAN.FIVE, swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new MissingMeals(day, { swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new DayMealList(day.meals, date, [], { layout: 'page', swapOob: HTMX_SWAP.ReplaceElement }).render()}
  `;
  return reply.type('text/html').send(template);
};

export const deleteDish = async (request: DeleteDishRequest, reply: FastifyReply) => {
  const { date, mealType, dishId } = request.params;

  await mealRepository.deleteDish(paramToDate(date), mealType, dishId);
  const meal = await mealRepository.fetchMeal(paramToDate(date), mealType);
  const day = await mealRepository.fetchDay(paramToDate(date));
  const ingredients = await selectIngredients();

  const template = `
    ${await new DayStats(day, { layout: 'vertical', swapOob: HTMX_SWAP.ReplaceElement }).render()}
    ${await new DayMeal(meal, ingredients, {
      layout: 'page',
      swapOob: HTMX_SWAP.ReplaceElement,
    }).render()}
  `;

  return reply.type('text/html').send(template);
};