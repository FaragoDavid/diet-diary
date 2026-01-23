import { MealType } from '../config';
import * as mealRepository from '../repository/meal';

export async function getMealWithResources(
  date: Date,
  mealType: MealType,
): Promise<{
  meal: mealRepository.MealWithDishes;
  day: mealRepository.DayWithMealsWithDishes;
} | null> {
  const [meal, day] = await Promise.all([mealRepository.fetchMeal(date, mealType), mealRepository.fetchDay(date)]);

  if (!meal || !day) return null;

  return { meal, day };
}

export async function addDishToMeal(date: Date, mealType: MealType, dishId: string, amount: number) {
  const dish = await mealRepository.addDish(date, mealType, dishId, amount);

  const [day, meal] = await Promise.all([mealRepository.fetchDay(date), mealRepository.fetchMeal(date, mealType)]);

  if (!day || !meal) {
    throw new Error('Day or meal not found after adding dish');
  }

  return { dish, day, meal };
}

export async function updateDishAmount(dishId: string, amount: number, date: Date, mealType: MealType) {
  await mealRepository.updateDish(dishId, amount);

  const [day, meal] = await Promise.all([mealRepository.fetchDay(date), mealRepository.fetchMeal(date, mealType)]);

  if (!day || !meal) {
    throw new Error('Day or meal not found after updating dish');
  }

  return { day, meal };
}

export async function removeDish(dishId: string, date: Date, mealType: MealType) {
  await mealRepository.deleteDish(dishId);

  const [meal, day] = await Promise.all([mealRepository.fetchMeal(date, mealType), mealRepository.fetchDay(date)]);

  if (!meal || !day) {
    throw new Error('Meal or day not found after deleting dish');
  }

  return { meal, day };
}

export async function addMealToDay(date: Date, mealType: MealType) {
  await mealRepository.addMeal(date, mealType);

  const day = await mealRepository.fetchDay(date);

  if (!day) {
    throw new Error('Day not found after adding meal');
  }

  return day;
}

export async function removeMeal(date: Date, mealType: MealType) {
  await mealRepository.deleteMeal(date, mealType);

  const day = await mealRepository.fetchDay(date);

  if (!day) {
    throw new Error('Day not found after deleting meal');
  }

  return day;
}
