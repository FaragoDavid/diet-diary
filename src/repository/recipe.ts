import { v4 as uuid } from 'uuid';

import { ingredients } from './ingredient.js';
import prisma from '../utils/prisma-client.js';

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
      amount: Math.random() > 0.6 ? Math.floor(Math.random() * 99) + 1 : undefined,
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

export async function fetchRecipes(query: string = '') {
  return await prisma.recipe.findMany({
    where: { name: { contains: query } },
    select: {
      id: true,
      name: true,
      amount: true,
      servings: true,
      ingredients: {
        select: { amount: true, ingredient: true },
      },
    },
  });
}

export type RecipeWithIngredients = NonNullable<Awaited<ReturnType<typeof fetchRecipe>>>;
export async function fetchRecipe(id: string) {
  return await prisma.recipe.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      amount: true,
      servings: true,
      ingredients: {
        select: { amount: true, ingredient: true },
      },
    },
  });
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
  return await prisma.recipe.create({ 
    data: { name },
    select: {
      id: true,
      name: true,
      amount: true,
      servings: true,
      ingredients: {
        select: { amount: true, ingredient: true },
      },
    },
  });
}

export async function updateRecipe(id: string, ingredients: RecipeIngredient[]) {
  const recipe = recipes.find((recipe) => recipe.id === id);
  if (!recipe) throw new Error('Recipe not found');
  recipe.ingredients = ingredients;
}

export async function deleteRecipe(id: string) {
  await prisma.recipe.delete({ where: { id } });
}

export async function insertRecipeIngredient(recipeId: string, ingredientId: string, amount: number) {
  return await prisma.recipeIngredient.create({
    data: { recipeId, ingredientId, amount },
    select: { amount: true, ingredient: true },
  });
}

export async function updateRecipeIngredientAmount(recipeId: string, ingredientId: string, amount: number): Promise<RecipeWithIngredientName> {
  const recipe = recipes.find((recipe) => recipe.id === recipeId);
  if (!recipe) throw new Error('Recipe not found');

  const ingredient = recipe.ingredients.find((ingredient) => ingredient.id === ingredientId);
  if (!ingredient) throw new Error('Ingredient not found in recipe');

  recipe.ingredients.forEach((ingredient) => {
    if (ingredient.id === ingredientId) {
      ingredient.amount = amount;
    }
  });
  
  return extendRecipeWithIngredientName(recipe);
}

export async function deleteRecipeIngredient(recipeId: string, ingredientId: string): Promise<RecipeWithIngredientName> {
  const recipe = recipes.find((recipe) => recipe.id === recipeId);
  if (!recipe) throw new Error('Recipe not found');

  const recipeIngredient = recipe.ingredients.find((ingredient) => ingredient.id === ingredientId);
  if (!recipeIngredient) throw new Error('Ingredient not found in recipe');

  recipe.ingredients = recipe.ingredients.filter((ingredient) => ingredient.id !== ingredientId);

  return extendRecipeWithIngredientName(recipe);
}

export async function updateRecipeAmount(recipeId: string, amount: number) {
  await prisma.recipe.update({ where: { id: recipeId }, data: { amount } });
}
