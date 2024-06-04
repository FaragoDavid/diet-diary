import { randomInt } from 'crypto';
import { endOfDay, isSameDay, subDays } from 'date-fns';
import { v4 as uuid } from 'uuid';

import config, { MealType } from '../config.js';
import { nutrientFromDish } from '../utils/nutrient-from-dish.js';
import prisma from '../utils/prisma-client.js';
import { ingredients } from './ingredient.js';

export type Dish = {
  id: string;
  name: string;
  amount: number;
  calories: number;
  carbs: number;
  fat: number;
};

export type Meal = {
  id: string;
  type: MealType;
  date: Date;
  dishes: Dish[];
};

export type Day = { date: Date; meals: Omit<Meal, 'date'>[] };

const meals = (() => {
  const days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i));
  let result: Meal[] = [];

  for (const day of days) {
    const meals: Meal[] = [];
    const count = Math.floor(Math.random() * 6) + 1;
    while (meals.length < count) {
      const missingMeals = config.mealTypes.filter(({ key }) => !meals.some((meal) => meal.type === key));
      const type = missingMeals[Math.floor(Math.random() * missingMeals.length)]!.key;
      const dishes = Array.from({ length: Math.floor(Math.random() * 3) }, () => {
        const ingredient = ingredients[randomInt(ingredients.length - 1)];
        const amount = Math.floor(Math.random() * 399) + 1;
        return {
          id: ingredient!.id,
          name: ingredient!.name,
          amount,
          calories: nutrientFromDish(ingredient!.id, amount, 'calories', ingredients),
          carbs: nutrientFromDish(ingredient!.id, amount, 'carbs', ingredients),
          fat: nutrientFromDish(ingredient!.id, amount, 'fat', ingredients),
        } as Dish;
      });
      meals.push({ id: uuid(), type, date: day, dishes });
    }
    result = result.concat(meals);
  }

  result.sort((a, b) => {
    if (a.date.getTime() !== b.date.getTime()) return a.date.getTime() - b.date.getTime();
    const aIndex = config.mealTypes.findIndex(({ key }) => key === a.type);
    const bIndex = config.mealTypes.findIndex(({ key }) => key === b.type);
    return aIndex - bIndex;
  });

  return result;
})();

const days = ((meals: Meal[]): Day[] =>
  meals.reduce((days, { date: nextMealDate, ...nextMeal }) => {
    const day = days.find(({ date }) => isSameDay(date, nextMealDate));
    if (!day) days.push({ date: nextMealDate, meals: [nextMeal] });
    else day.meals.push(nextMeal);
    return days;
  }, [] as Day[]))(meals);

export async function fetchDays(start: Date, end: Date) {
  end = endOfDay(end);
  return await prisma.day.findMany({
    where: { date: { gte: start, lte: end } },
    orderBy: { date: 'desc' },
    select: {
      date: true,
      meals: {
        select: {
          type: true,
          calories: true,
          carbs: true,
          fat: true,
          dishes: {
            select: { id: true, name: true, amount: true, calories: true, carbs: true, fat: true },
          },
        },
      },
    },
  });
}

export type DayMealsWithDishes = NonNullable<Awaited<ReturnType<typeof fetchDay>>>;
export async function fetchDay(date: Date) {
  return await prisma.day.findUnique({
    where: { date },
    select: {
      date: true,
      meals: {
        select: {
          type: true,
          calories: true,
          carbs: true,
          fat: true,
          dishes: {
            select: { id: true, name: true, amount: true, calories: true, carbs: true, fat: true },
          },
        },
      },
    },
  });
}

export async function fetchMeal(date: Date, mealType: MealType) {
  return await prisma.meal.findUnique({
    where: { date_type: { date, type: mealType } },
    select: {
      type: true,
      calories: true,
      carbs: true,
      fat: true,
      dishes: {
        select: { id: true, name: true, amount: true, calories: true, carbs: true, fat: true },
      },
    },
  });
}

export async function createDay(date: Date) {
  return await prisma.day.create({
    data: { date },
    select: {
      date: true,
      meals: {
        select: {
          type: true,
          calories: true,
          carbs: true,
          fat: true,
          dishes: {
            select: { id: true, name: true, amount: true, calories: true, carbs: true, fat: true },
          },
        },
      },
    },
  });
}

export async function addMeal(date: Date, type: MealType) {
  return await prisma.meal.create({
    data: {
      date,
      type: type as string,
      Day: { connect: { date } },
    },
    select: {
      type: true,
      calories: true,
      carbs: true,
      fat: true,
      dishes: {
        select: { id: true, name: true, amount: true, calories: true, carbs: true, fat: true },
      },
    },
  });
}

export async function insertDish(date: Date, mealType: MealType, dishId: string, amount: number): Promise<Dish> {
  const meal = meals.find((meal) => isSameDay(meal.date, date) && meal.type === mealType);
  if (!meal) throw new Error('Meal not found');
  const ingredient = ingredients.find(({ id }) => id === dishId);
  if (!ingredient) throw new Error('Ingredient not found');

  const newDish: Dish = {
    id: dishId,
    amount,
    name: ingredient.name,
    calories: nutrientFromDish(dishId, amount, 'calories', ingredients),
    carbs: nutrientFromDish(dishId, amount, 'carbs', ingredients),
    fat: nutrientFromDish(dishId, amount, 'fat', ingredients),
  };
  meal.dishes.push(newDish);

  return newDish;
}

export async function deleteMeal(date: Date, mealType: MealType): Promise<Day> {
  const day = days.find((day) => isSameDay(day.date, date));
  if (!day) throw new Error(`Day ${date} not found`);
  const meal = day.meals.findIndex((meal) => meal.type === mealType);
  if (meal === -1) throw new Error(`Meal ${mealType} not found for ${date}`);

  const mealIndex = meals.findIndex((meal) => isSameDay(meal.date, date) && meal.type === mealType);
  if (mealIndex === -1) throw new Error(`Meal ${mealType} not found`);
  meals.splice(mealIndex, 1);

  day.meals.splice(meal, 1);

  return day;
}

export async function deleteDish(date: Date, mealType: MealType, dishId: string): Promise<Meal> {
  const meal = meals.find((meal) => isSameDay(meal.date, date) && meal.type === mealType);
  if (!meal) throw new Error('Meal not found');
  const dish = meal.dishes.findIndex((dish) => dish.id === dishId);
  if (dish === -1) throw new Error('Dish not found');

  meal.dishes.splice(dish, 1);

  return meal;
}