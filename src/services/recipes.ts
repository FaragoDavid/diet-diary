import { collection, doc, setDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { getDb } from './firebase';

import { MOCK_RECIPES } from '../constants/mock-data';
import type { Recipe, RecipeUpdate } from '../types/recipe';

const KEY = 'recipes';

if (import.meta.env.DEV && !localStorage.getItem(KEY)) {
  localStorage.setItem(KEY, JSON.stringify(MOCK_RECIPES));
}

let isDirty = false;

function saveRecipes(recipes: Recipe[]): void {
  localStorage.setItem(KEY, JSON.stringify(recipes));
}

export function readRecipes(): Recipe[] {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

export async function syncRecipes(): Promise<void> {
  if (!isDirty) return;
  isDirty = false;
  await Promise.all(readRecipes().map((recipe) => setDoc(doc(getDb(), 'recipes', recipe.id), recipe)));
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
  const id = import.meta.env.DEV ? `rec-${Date.now()}` : doc(collection(getDb(), 'recipes')).id;
  const updated = [...readRecipes(), { ...newRecipe, id }];
  saveRecipes(updated);
  if (!import.meta.env.DEV) isDirty = true;
  return { id, recipes: updated };
}

export function updateRecipe(id: string, data: RecipeUpdate): Recipe[] {
  const updated = readRecipes().map((rec) => (rec.id === id ? { ...rec, ...data } : rec));
  saveRecipes(updated);
  if (!import.meta.env.DEV) isDirty = true;
  return updated;
}

export async function deleteRecipe(id: string): Promise<Recipe[]> {
  const updated = readRecipes().filter((rec) => rec.id !== id);
  saveRecipes(updated);
  if (!import.meta.env.DEV) {
    await deleteDoc(doc(getDb(), 'recipes', id));
  }
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
  const id = import.meta.env.DEV ? `rec-${Date.now()}` : doc(collection(getDb(), 'recipes')).id;
  const updated = [...readRecipes(), { ...variant, id }];
  saveRecipes(updated);
  if (!import.meta.env.DEV) isDirty = true;
  return { id, recipes: updated };
}

export async function refreshRecipes(): Promise<Recipe[]> {
  if (import.meta.env.DEV) {
    saveRecipes(MOCK_RECIPES);
    return MOCK_RECIPES;
  }
  const recipesInFirestore = (await getDocs(query(collection(getDb(), 'recipes'), orderBy('name')))).docs;
  const recipes = recipesInFirestore.map((recipeDoc) => ({ id: recipeDoc.id, ...recipeDoc.data() }) as Recipe);
  saveRecipes(recipes);
  return recipes;
}

export async function refreshRecipesIfNeeded(): Promise<Recipe[] | null> {
  if (import.meta.env.DEV || localStorage.getItem(KEY) !== null) return null;
  return refreshRecipes();
}
