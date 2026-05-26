import type { Ingredient } from '../types/ingredient';
import type { Recipe, RecipeIngredient } from '../types/recipe';

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
    (recipeNutrition, { ingredientId, amount }) => {
      const ingredient = ingredientsMap.get(ingredientId);
      if (!ingredient) return recipeNutrition;
      const { calories, carbs, fat } = calculateIngredientNutrition(ingredient, amount);
      return { calories: recipeNutrition.calories + calories, carbs: recipeNutrition.carbs + carbs, fat: recipeNutrition.fat + fat };
    },
    { calories: 0, carbs: 0, fat: 0 },
  );
}

export function recipeToIngredient(recipe: Recipe): Ingredient {
  const amount = recipe.amount || 100;
  return {
    id: recipe.id,
    name: recipe.name,
    caloriesPer100: (recipe.calories / amount) * 100,
    carbsPer100: (recipe.carbs / amount) * 100,
    fatPer100: (recipe.fat / amount) * 100,
    isVegetable: false,
    carbLimit: null,
  };
}

export function buildIngredientMap(ingredients: Ingredient[], recipes: Recipe[]): Map<string, Ingredient> {
  const map = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));
  for (const recipe of recipes) {
    if (!map.has(recipe.id)) map.set(recipe.id, recipeToIngredient(recipe));
  }
  return map;
}
