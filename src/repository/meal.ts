import { randomInt } from 'crypto';
import { endOfDay, isSameDay, isWithinInterval, subDays } from 'date-fns';
import { v4 as uuid } from 'uuid';

import config, { MealType } from '../config.js';
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
      const missingMeals = config.mealTypes.filter(({key}) => !meals.some(meal => meal.type === key));
      const type = missingMeals[Math.floor(Math.random() * missingMeals.length)]!.key;
      const dishes = Array.from(
        { length: Math.floor(Math.random() * 3) },
        () =>
          ({
            id: ingredients[randomInt(ingredients.length - 1)]!.id,
            amount: Math.floor(Math.random() * 399) + 1,
          } as Dish),
      );
      meals.push({ id: uuid(), type, date: day, dishes });
    }
    result = result.concat(meals);
  }
  return result;
})();

const days = ((meals: Meal[]): Day[] =>
  meals.reduce((days, { date: nextMealDate, ...nextMeal }) => {
    const day = days.find(({ date }) => isSameDay(date, nextMealDate));
    if (!day) days.push({ date: nextMealDate, meals: [nextMeal] });
    else day.meals.push(nextMeal);
    return days;
  }, [] as Day[]))(meals);

export async function fetchDayMeals(start: Date, end: Date) {
  end = endOfDay(end);
  return meals
    .reduce((days, { date: nextMealDate, ...nextMeal }) => {
      if (isWithinInterval(nextMealDate, { start, end })) {
        const mealWithMacros = {
          ...nextMeal,
          dishes: nextMeal.dishes.map((dish) => ({
            ...dish,
            calories: Math.floor((ingredients.find(({ id }) => id === dish.id)!.calories / 100) * dish.amount),
            carbs: Math.floor((ingredients.find(({ id }) => id === dish.id)!.carbs / 100) * dish.amount),
            fat: Math.floor((ingredients.find(({ id }) => id === dish.id)!.fat / 100) * dish.amount),
          })),
        };

        const day = days.find(({ date }) => isSameDay(date, nextMealDate));
        if (!day) days.push({ date: nextMealDate, meals: [mealWithMacros] });
        else day.meals.push(mealWithMacros);
      }
      return days;
    }, [] as Day[])
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function fetchDay(date: Date): Promise<Day> {
  const day = days.find((day) => isSameDay(day.date, date));
  if (!day) throw new Error('Day not found');
  return day;
}

export async function fetchMeal(date: Date, mealType: MealType): Promise<Meal> {
  const meal = meals.find((meal) => isSameDay(meal.date, date) && meal.type === mealType);
  if (!meal) throw new Error('Meal not found');
  return meal;
}

export async function createDay(date: Date): Promise<Day> {
  if (meals.find((meal) => isSameDay(meal.date, date))) throw new Error('Day already exists');

  const newDay = { date, meals: [] };
  days.push(newDay);

  return newDay;
}

export async function addMeal(date: Date, type: MealType): Promise<Meal> {
  const newMeal = { id: uuid(), type, date, dishes: [] };
  meals.push(newMeal);
  days.find((day) => isSameDay(day.date, date))!.meals.push(newMeal);

  return newMeal;
}

export async function addDish(date: Date, mealType: MealType, mealId: string, amount: number): Promise<Dish> {
  const meal = meals.find((meal) => isSameDay(meal.date, date) && meal.type === mealType);
  if (!meal) throw new Error('Meal not found');
  const ingredient = ingredients.find(({ id }) => id === mealId);
  if (!ingredient) throw new Error('Ingredient not found');

  const newDish: Dish = {
    id: mealId,
    amount,
    name: ingredient.name,
    calories: Math.floor((ingredient.calories / 100) * amount),
    carbs: Math.floor((ingredient.carbs / 100) * amount),
    fat: Math.floor((ingredient.fat / 100) * amount),
  };
  meal.dishes.push(newDish);

  return newDish;
}