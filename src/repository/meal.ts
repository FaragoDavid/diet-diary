import { Day, Ingredient, Prisma } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';

import { MealType } from '../config.js';
import prisma from '../utils/prisma-client.js';
import { RecipeWithIngredients, fetchRecipe } from './recipe.js';

const dishSelect: Prisma.DishSelect = { id: true, name: true, amount: true, calories: true, carbs: true, fat: true, ingredientId: true, recipeId: true };

const mealWithDishesSelect: Prisma.MealSelect = {
  type: true,
  calories: true,
  carbs: true,
  fat: true,
  dishes: {
    select: dishSelect,
  },
};

export async function fetchDays({ fromDate, toDate }: { fromDate?: Date; toDate?: Date } = {}) {
  const where: Prisma.DayWhereInput = {};
  if (fromDate) {
    where.date = { gte: startOfDay(fromDate) };
    (where.date as Prisma.DateTimeFilter<'Day'>).gte = startOfDay(fromDate);
  }
  if (toDate) {
    if(!where.date) where.date = {};
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

export async function addDish(date: Date, mealType: MealType, dishId: string, amount: number) {
  const ingredient = await prisma.ingredient.findUnique({ where: { id: dishId } });
  if (ingredient) {
    return await addRawIngredientToMeal(date, mealType, ingredient, amount, dishSelect);
  }
  const recipe = await fetchRecipe(dishId);
  if (recipe) {
    return await addRecipeToMeal(date, mealType, recipe, amount, dishSelect);
  }
  throw new Error('Dish is neither a recipe nor an ingredient');
}

async function addRawIngredientToMeal(date: Date, mealType: MealType, ingredient: Ingredient, amount: number, select: Prisma.DishSelect) {
  return await prisma.dish.create({
    data: {
      mealDate: date,
      mealType,
      name: ingredient.name,
      ingredientId: ingredient.id,
      calories: ((ingredient.caloriesPer100 || 0) / 100) * amount,
      carbs: ((ingredient.carbsPer100 || 0) / 100) * amount,
      fat: ((ingredient.fatPer100 || 0) / 100) * amount,
      amount,
    },
    select,
  });
}

async function addRecipeToMeal(date: Date, mealType: MealType, recipe: RecipeWithIngredients, amount: number, select: Prisma.DishSelect) {
  const { calories, carbs, fat } = recipe.ingredients.reduce(
    (acc, { amount: ingredientAmount, ingredient }) => {
      const ingredientCalories = ((ingredient.caloriesPer100 || 0) / 100) * ingredientAmount;
      const ingredientCarbs = ((ingredient.carbsPer100 || 0) / 100) * ingredientAmount;
      const ingredientFat = ((ingredient.fatPer100 || 0) / 100) * ingredientAmount;
      return {
        calories: acc.calories + ingredientCalories,
        carbs: acc.carbs + ingredientCarbs,
        fat: acc.fat + ingredientFat,
      };
    },
    { calories: 0, carbs: 0, fat: 0 },
  );

  return await prisma.dish.create({
    data: {
      mealDate: date,
      mealType,
      name: recipe.name,
      recipeId: recipe.id,
      calories: calories * amount,
      carbs: carbs * amount,
      fat: fat * amount,
      amount,
    },
    select,
  });
}

export async function deleteDish(id: string) {
  await prisma.dish.deleteMany({ where: { id } });
}
