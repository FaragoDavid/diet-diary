import { Ingredient } from '@prisma/client';

import { MealType } from '../config';
import * as ingredientRepository from '../repository/ingredient';
import * as mealRepository from '../repository/meal';
import * as recipeRepository from '../repository/recipe';

function calculateIngredientNutrition(ingredient: Ingredient, amount: number) {
  return {
    calories: ((ingredient.caloriesPer100 || 0) / 100) * amount,
    carbs: ((ingredient.carbsPer100 || 0) / 100) * amount,
    fat: ((ingredient.fatPer100 || 0) / 100) * amount,
  };
}

function calculateRecipeNutrition(recipe: recipeRepository.RecipeWithIngredients, amount: number) {
  const { calories, carbs, fat } = recipe.ingredients.reduce(
    (acc, { amount: ingredientAmount, ingredient }) => {
      const nutrition = calculateIngredientNutrition(ingredient, ingredientAmount);
      return {
        calories: acc.calories + nutrition.calories,
        carbs: acc.carbs + nutrition.carbs,
        fat: acc.fat + nutrition.fat,
      };
    },
    { calories: 0, carbs: 0, fat: 0 },
  );

  return {
    calories: calories * amount,
    carbs: carbs * amount,
    fat: fat * amount,
  };
}

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
  const ingredient = await ingredientRepository.fetchIngredient(dishId);
  if (ingredient) {
    const nutrition = calculateIngredientNutrition(ingredient, amount);
    const dish = await mealRepository.addDish(date, mealType, {
      name: ingredient.name,
      ingredientId: ingredient.id,
      recipeId: null,
      amount,
      ...nutrition,
    });

    const [day, meal] = await Promise.all([mealRepository.fetchDay(date), mealRepository.fetchMeal(date, mealType)]);

    if (!day || !meal) {
      throw new Error('Day or meal not found after adding dish');
    }

    return { dish, day, meal };
  }

  const recipe = await recipeRepository.fetchRecipe(dishId);
  if (recipe) {
    const nutrition = calculateRecipeNutrition(recipe, amount);
    const dish = await mealRepository.addDish(date, mealType, {
      name: recipe.name,
      ingredientId: null,
      recipeId: recipe.id,
      amount,
      ...nutrition,
    });

    const [day, meal] = await Promise.all([mealRepository.fetchDay(date), mealRepository.fetchMeal(date, mealType)]);

    if (!day || !meal) {
      throw new Error('Day or meal not found after adding dish');
    }

    return { dish, day, meal };
  }

  throw new Error('Dish is neither a recipe nor an ingredient');
}

export async function updateDishAmount(dishId: string, amount: number, date: Date, mealType: MealType) {
  const dish = await mealRepository.fetchDish(dishId);

  if (!dish) {
    throw new Error('Dish not found');
  }

  const oldAmount = dish.amount;
  const multiply = amount / oldAmount;

  await mealRepository.updateDish(dishId, {
    amount,
    calories: dish.calories * multiply,
    carbs: dish.carbs * multiply,
    fat: dish.fat * multiply,
  });

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
