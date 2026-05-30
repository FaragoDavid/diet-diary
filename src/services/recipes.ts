import { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { getDb } from './firebase';

import { MOCK_RECIPES } from '../constants/mock-data';
import type { Recipe, RecipeUpdate } from '../types/recipe';

const KEY = 'recipes';

if (import.meta.env.DEV && !localStorage.getItem(KEY)) {
  localStorage.setItem(KEY, JSON.stringify(MOCK_RECIPES));
}

let notify: ((items: Recipe[]) => void) | null = null;

function read(): Recipe[] {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

function saveRecipesToLocalStorage(items: Recipe[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  notify?.(items);
}

let isDirty = false;

export async function syncRecipes(): Promise<void> {
  if (!isDirty) return;
  isDirty = false;
  const recipes = read();
  await Promise.all(recipes.map((recipe) => setDoc(doc(getDb(), 'recipes', recipe.id), recipe)));
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(read);
  notify = setRecipes;
  useEffect(() => {
    if (!import.meta.env.DEV && localStorage.getItem(KEY) === null) {
      refreshRecipes();
    }
  }, []);
  return { recipes };
}

export function createRecipe(name: string): string {
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
  saveRecipesToLocalStorage([...read(), { ...newRecipe, id }].sort((r1, r2) => r1.name.localeCompare(r2.name)));
  if (!import.meta.env.DEV) isDirty = true;
  return id;
}

export function updateRecipe(id: string, data: RecipeUpdate) {
  saveRecipesToLocalStorage(read().map((rec) => (rec.id === id ? { ...rec, ...data } : rec)));
  if (import.meta.env.DEV) return;
  isDirty = true;
}

export async function deleteRecipe(id: string) {
  saveRecipesToLocalStorage(read().filter((rec) => rec.id !== id));
  if (import.meta.env.DEV) return;
  await deleteDoc(doc(getDb(), 'recipes', id));
}

export function createVariant(baseRecipe: Recipe): string {
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
  saveRecipesToLocalStorage([...read(), { ...variant, id }].sort((r1, r2) => r1.name.localeCompare(r2.name)));
  if (!import.meta.env.DEV) isDirty = true;
  return id;
}

export async function refreshRecipes() {
  if (import.meta.env.DEV) {
    saveRecipesToLocalStorage(MOCK_RECIPES);
    return;
  }
  const recipesInFirestore = (await getDocs(query(collection(getDb(), 'recipes'), orderBy('name')))).docs;
  saveRecipesToLocalStorage(recipesInFirestore.map((recipeDoc) => ({ id: recipeDoc.id, ...recipeDoc.data() }) as Recipe));
}
