export interface RecipeIngredient {
  ingredientId: string;
  name: string;
  amount: number;
}

export interface Recipe {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  amount: number | null;
  servings: number;
  baseRecipeId: string | null;
  imageUrl?: string;
  ingredients: RecipeIngredient[];
}

export type NewRecipe = Omit<Recipe, 'id'>;
export type RecipeUpdate = Partial<Omit<Recipe, 'id'>>;
