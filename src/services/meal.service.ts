import { Ingredient, Recipe } from '@prisma/client';
import { MealType } from '../config';
import * as ingredientRepository from '../repository/ingredient';
import * as mealRepository from '../repository/meal';
import * as recipeRepository from '../repository/recipe';

export class MealService {
  async getDayWithResources(
    date: Date,
  ): Promise<{ day: mealRepository.DayWithMealsWithDishes; ingredients: Ingredient[]; recipes: Recipe[] } | null> {
    const [day, ingredients, recipes] = await Promise.all([
      mealRepository.fetchDay(date),
      ingredientRepository.fetchIngredients(),
      recipeRepository.fetchRecipes(),
    ]);

    if (!day) return null;

    return { day, ingredients, recipes };
  }

  async getMealWithResources(
    date: Date,
    mealType: MealType,
  ): Promise<{
    meal: mealRepository.MealWithDishes;
    day: mealRepository.DayWithMealsWithDishes;
    ingredients: Ingredient[];
    recipes: Recipe[];
  } | null> {
    const [meal, day, ingredients, recipes] = await Promise.all([
      mealRepository.fetchMeal(date, mealType),
      mealRepository.fetchDay(date),
      ingredientRepository.fetchIngredients(),
      recipeRepository.fetchRecipes(),
    ]);

    if (!meal || !day) return null;

    return { meal, day, ingredients, recipes };
  }

  async addDishToMeal(date: Date, mealType: MealType, dishId: string, amount: number) {
    const dish = await mealRepository.addDish(date, mealType, dishId, amount);

    const [day, meal, ingredients, recipes] = await Promise.all([
      mealRepository.fetchDay(date),
      mealRepository.fetchMeal(date, mealType),
      ingredientRepository.fetchIngredients(),
      recipeRepository.fetchRecipes(),
    ]);

    if (!day || !meal) {
      throw new Error('Day or meal not found after adding dish');
    }

    return { dish, day, meal, ingredients, recipes };
  }

  async updateDishAmount(dishId: string, amount: number, date: Date, mealType: MealType) {
    await mealRepository.updateDish(dishId, amount);

    const [day, meal, ingredients, recipes] = await Promise.all([
      mealRepository.fetchDay(date),
      mealRepository.fetchMeal(date, mealType),
      ingredientRepository.fetchIngredients(),
      recipeRepository.fetchRecipes(),
    ]);

    if (!day || !meal) {
      throw new Error('Day or meal not found after updating dish');
    }

    return { day, meal, ingredients, recipes };
  }

  async removeDish(dishId: string, date: Date, mealType: MealType) {
    await mealRepository.deleteDish(dishId);

    const [meal, day, ingredients, recipes] = await Promise.all([
      mealRepository.fetchMeal(date, mealType),
      mealRepository.fetchDay(date),
      ingredientRepository.fetchIngredients(),
      recipeRepository.fetchRecipes(),
    ]);

    if (!meal || !day) {
      throw new Error('Meal or day not found after deleting dish');
    }

    return { meal, day, ingredients, recipes };
  }

  async addMealToDay(date: Date, mealType: MealType) {
    await mealRepository.addMeal(date, mealType);

    const [day, ingredients, recipes] = await Promise.all([
      mealRepository.fetchDay(date),
      ingredientRepository.fetchIngredients(),
      recipeRepository.fetchRecipes(),
    ]);

    if (!day) {
      throw new Error('Day not found after adding meal');
    }

    return { day, ingredients, recipes };
  }

  async removeMeal(date: Date, mealType: MealType) {
    await mealRepository.deleteMeal(date, mealType);

    const [day, ingredients, recipes] = await Promise.all([
      mealRepository.fetchDay(date),
      ingredientRepository.fetchIngredients(),
      recipeRepository.fetchRecipes(),
    ]);

    if (!day) {
      throw new Error('Day not found after deleting meal');
    }

    return { day, ingredients, recipes };
  }

  async createNewDay(date: Date) {
    const day = await mealRepository.createDay(date);

    const [ingredients, recipes] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipes()]);

    return { day, ingredients, recipes };
  }

  async getAllDays(options?: { fromDate?: Date; toDate?: Date }) {
    const [days, ingredients, recipes] = await Promise.all([
      mealRepository.fetchDays(options),
      ingredientRepository.fetchIngredients(),
      recipeRepository.fetchRecipes(),
    ]);

    return { days, ingredients, recipes };
  }
}

export const mealService = new MealService();
