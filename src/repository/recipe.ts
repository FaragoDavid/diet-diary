import { v4 as uuid } from 'uuid';

import { ingredients } from './ingredient.js';

export type RecipeIngredient = { id: string; amount: number };

export type RecipeIngredientWithName = RecipeIngredient & { name: string };

export type Recipe = {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  amount?: number;
};
export type RecipeWithIngredientName = Omit<Recipe, 'ingredients'> & {
  ingredients: RecipeIngredientWithName[];
};

const recipes: Recipe[] = ((count: number) => {
  const result: Recipe[] = [];
  for (let i = 1; i <= count; i++) {
    const ingredientCount = Math.floor(Math.random() * 3) + 1;
    const recipeIngredients: Set<RecipeIngredient> = new Set();
    for (let j = 0; j < ingredientCount; j++) {
      const ingredient = ingredients[Math.floor(Math.random() * ingredients.length)]!;
      recipeIngredients.add({
        id: ingredient.id,
        amount: Math.floor(Math.random() * 99) + 1,
      });
    }

    result.push({
      id: uuid(),
      name: `Recipe ${i}`,
      ingredients: Array.from(recipeIngredients),
    });
  }
  return result;
})(30);

function extendRecipeWithIngredientName(recipe: Recipe): RecipeWithIngredientName {
  return {
    ...recipe,
    ingredients: recipe.ingredients.map(
      (ingredient) =>
        ({
          ...ingredient,
          name: ingredients.find((ingr) => ingr.id === ingredient.id)!.name,
        } as RecipeIngredientWithName),
    ),
  };
}

export async function selectRecipes(query: string): Promise<RecipeWithIngredientName[]> {
  return recipes
    .filter((recipe) => recipe.name.toLowerCase().includes(query.toLowerCase()))
    .map((recipe) => extendRecipeWithIngredientName(recipe));
}

export async function selectRecipe(id: string): Promise<RecipeWithIngredientName> {
  const recipe = recipes.find((recipe) => recipe.id === id);
  if (!recipe) throw new Error('Recipe not found');

  return extendRecipeWithIngredientName(recipe);
}

export async function insertRecipe(name: string) {
  const newRecipe: RecipeWithIngredientName = { id: uuid(), name, ingredients: [] };
  recipes.push(newRecipe);
  return newRecipe;
}

export async function updateRecipe(id: string, ingredients: RecipeIngredient[]) {
  const recipe = recipes.find((recipe) => recipe.id === id);
  if (!recipe) return;
  recipe.ingredients = ingredients;
}

export async function insertRecipeIngredient(recipeId: string, ingredientId: string, amount: number) {
  const recipe = recipes.find((recipe) => recipe.id === recipeId);
  if (!recipe) return;

  recipe.ingredients.push({ id: ingredientId, amount });
}

export async function updateRecipeIngredientAmount(recipeId: string, ingredientId: string, amount: number) {
  const recipe = recipes.find((recipe) => recipe.id === recipeId);
  if (!recipe) return;

  recipe.ingredients.forEach((ingredient) => {
    if (ingredient.id === ingredientId) {
      ingredient.amount = amount;
    }
  });
}

export async function deleteRecipeIngredient(recipeId: string, ingredientId: string) {
  const recipe = recipes.find((recipe) => recipe.id === recipeId);
  if (!recipe) throw new Error('Recipe not found');

  recipe.ingredients = recipe.ingredients.filter((ingredient) => ingredient.id !== ingredientId);
}

export async function updateRecipeAmount(recipeId: string, amount: number) {
  const recipe = recipes.find((recipe) => recipe.id === recipeId);
  if (!recipe) return;

  recipe.amount = amount;
}
