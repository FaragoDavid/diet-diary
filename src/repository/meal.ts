import { Prisma } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';

import { MealType } from '../config';
import prisma from '../utils/prisma-client';

const dishSelect: Prisma.DishSelect = {
  id: true,
  name: true,
  amount: true,
  calories: true,
  carbs: true,
  fat: true,
  ingredientId: true,
  recipeId: true,
};

const mealWithDishesSelect: Prisma.MealSelect = {
  type: true,
  calories: true,
  carbs: true,
  fat: true,
  dishes: {
    select: dishSelect,
  },
};

type DishCreateData = {
  name: string;
  ingredientId: string | null;
  recipeId: string | null;
  amount: number;
  calories: number;
  carbs: number;
  fat: number;
};

type DishUpdateData = {
  amount: number;
  calories: number;
  carbs: number;
  fat: number;
};

export async function fetchDays({ fromDate, toDate }: { fromDate?: Date; toDate?: Date } = {}) {
  const where: Prisma.DayWhereInput = {};
  if (fromDate) {
    where.date = { gte: startOfDay(fromDate) };
    (where.date as Prisma.DateTimeFilter<'Day'>).gte = startOfDay(fromDate);
  }
  if (toDate) {
    if (!where.date) where.date = {};
    (where.date as Prisma.DateTimeFilter<'Day'>).lte = endOfDay(toDate);
  }
  return await prisma.day.findMany({
    ...(where && { where }),
    select: {
      date: true,
      meals: {
        select: mealWithDishesSelect,
      },
    },
    orderBy: { date: 'desc' },
    take: !fromDate && !toDate ? 30 : undefined,
  });
}

export type DayWithMealsWithDishes = NonNullable<Prisma.PromiseReturnType<typeof fetchDay>>;
export async function fetchDay(date: Date) {
  return await prisma.day.findUnique({
    where: { date },
    select: {
      date: true,
      meals: {
        select: mealWithDishesSelect,
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
        select: mealWithDishesSelect,
      },
    },
  });
}

export type MealWithDishes = NonNullable<Prisma.PromiseReturnType<typeof fetchMeal>>;
export async function fetchMeal(date: Date, mealType: MealType) {
  return await prisma.meal.findUnique({
    where: { date_type: { date, type: mealType } },
    select: mealWithDishesSelect,
  });
}

export async function addMeal(date: Date, type: MealType) {
  return await prisma.meal.create({
    data: {
      date,
      type: type as string,
      Day: { connect: { date } },
    },
    select: mealWithDishesSelect,
  });
}

export async function deleteMeal(date: Date, mealType: MealType) {
  await prisma.meal.delete({
    where: { date_type: { date, type: mealType } },
  });
}

export async function addDish(date: Date, mealType: MealType, dishData: DishCreateData) {
  return await prisma.dish.create({
    data: {
      mealDate: date,
      mealType,
      ...dishData,
    },
    select: dishSelect,
  });
}

export async function fetchDish(id: string) {
  return await prisma.dish.findUnique({
    where: { id },
    select: { id: true, amount: true, calories: true, carbs: true, fat: true, ingredientId: true, recipeId: true, name: true },
  });
}

export async function deleteDish(id: string) {
  await prisma.dish.deleteMany({ where: { id } });
}

export async function updateDish(id: string, dishData: DishUpdateData) {
  await prisma.dish.update({
    where: { id },
    data: dishData,
  });
}
