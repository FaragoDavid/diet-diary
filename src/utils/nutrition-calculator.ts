import { Ingredient } from '@prisma/client';

export function calculateIngredientNutrition(ingredient: Ingredient, amount: number) {
  return {
    calories: ((ingredient.caloriesPer100 || 0) / 100) * amount,
    carbs: ((ingredient.carbsPer100 || 0) / 100) * amount,
    fat: ((ingredient.fatPer100 || 0) / 100) * amount,
  };
}
