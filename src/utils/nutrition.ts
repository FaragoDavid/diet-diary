import { TEXTS } from '../constants/texts';
import type { Ingredient } from '../types/ingredient';
import type { RecipeIngredient } from '../types/recipe';

interface NutritionValues {
  calories: number;
  carbs: number;
  fat: number;
}

export function calculateIngredientNutrition(ingredient: Ingredient, amount: number): NutritionValues {
  return {
    calories: ((ingredient.caloriesPer100 || 0) / 100) * amount,
    carbs: ((ingredient.carbsPer100 || 0) / 100) * amount,
    fat: ((ingredient.fatPer100 || 0) / 100) * amount,
  };
}

export function calculateRecipeNutrition(recipeIngredients: RecipeIngredient[], ingredientsMap: Map<string, Ingredient>): NutritionValues {
  return recipeIngredients.reduce(
    (totals, ri) => {
      const ingredient = ingredientsMap.get(ri.ingredientId);
      if (!ingredient) return totals;
      const n = calculateIngredientNutrition(ingredient, ri.amount);
      return { calories: totals.calories + n.calories, carbs: totals.carbs + n.carbs, fat: totals.fat + n.fat };
    },
    { calories: 0, carbs: 0, fat: 0 },
  );
}

export function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function formatNutrition(values: { calories: number; carbs: number; fat: number }): string {
  const cal = TEXTS.nutrients.cal.toLowerCase();
  const ch = TEXTS.nutrients.ch.toLowerCase();
  const fat = TEXTS.nutrients.fat.toLowerCase();
  return `${round(values.calories)} ${cal} · ${round(values.carbs)}g ${ch} · ${round(values.fat)}g ${fat}`;
}

export function getNutrientColor(actual: number, target: number | undefined): string {
  if (!target) return '';
  const deviation = Math.abs(actual - target) / target;
  if (deviation > 0.2) return 'text-error';
  if (deviation > 0.1) return 'text-warning';
  return '';
}
