import { firestoreClient } from './firestore-client';
import { notifyDirty } from '../contexts/dirty-context';
import { MOCK_RECIPES } from '../constants/mock-data';
import type { Recipe, RecipeUpdate } from '../types/recipe';

const KEY = 'recipes';

if (import.meta.env.DEV && !localStorage.getItem(KEY)) {
  localStorage.setItem(KEY, JSON.stringify(MOCK_RECIPES));
}

function saveRecipes(recipes: Recipe[]): void {
  localStorage.setItem(KEY, JSON.stringify(recipes));
}

export function readRecipes(): Recipe[] {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

export async function syncRecipes(): Promise<void> {
  const recipes = readRecipes().map((recipe) => (recipe.id ? recipe : { ...recipe, id: firestoreClient.generateId('recipes') }));
  saveRecipes(recipes);
  await Promise.all(recipes.map((recipe) => firestoreClient.setDocument('recipes', recipe.id, recipe)));
}

export function createRecipe(name: string): { id: string; recipes: Recipe[] } {
  const newRecipe: Recipe = {
    id: '',
    name,
    calories: 0,
    carbs: 0,
    fat: 0,
    amount: null,
    servings: 1,
    baseRecipeId: null,
    ingredients: [],
  };
  const id = firestoreClient.generateId('recipes');
  const updated = [...readRecipes(), { ...newRecipe, id }];
  saveRecipes(updated);
  notifyDirty();
  return { id, recipes: updated };
}

export function updateRecipe(id: string, data: RecipeUpdate): Recipe[] {
  const updated = readRecipes().map((rec) => (rec.id === id ? { ...rec, ...data } : rec));
  saveRecipes(updated);
  notifyDirty();
  return updated;
}

export async function deleteRecipe(id: string): Promise<Recipe[]> {
  const updated = readRecipes().filter((rec) => rec.id !== id);
  saveRecipes(updated);
  await firestoreClient.deleteDocument('recipes', id);
  return updated;
}

export function createVariant(baseRecipe: Recipe): { id: string; recipes: Recipe[] } {
  const variant: Recipe = {
    id: '',
    name: baseRecipe.name,
    calories: baseRecipe.calories,
    carbs: baseRecipe.carbs,
    fat: baseRecipe.fat,
    amount: baseRecipe.amount,
    servings: baseRecipe.servings,
    baseRecipeId: baseRecipe.baseRecipeId ?? baseRecipe.id,
    ingredients: [...baseRecipe.ingredients],
  };
  const id = firestoreClient.generateId('recipes');
  const updated = [...readRecipes(), { ...variant, id }];
  saveRecipes(updated);
  notifyDirty();
  return { id, recipes: updated };
}

export async function refreshRecipes(): Promise<Recipe[]> {
  const docs = await firestoreClient.getAll('recipes', { orderByField: 'name' });
  const recipes = docs as unknown as Recipe[];
  saveRecipes(recipes);
  return recipes;
}

export async function refreshRecipesIfNeeded(): Promise<Recipe[] | null> {
  if (import.meta.env.DEV || localStorage.getItem(KEY) !== null) return null;
  return refreshRecipes();
}
