import { useState, useEffect } from 'react';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
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

function set(items: Recipe[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  notify?.(items);
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

export async function createRecipe(name: string): Promise<string> {
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
  const id = import.meta.env.DEV ? `rec-${Date.now()}` : (await addDoc(collection(getDb(), 'recipes'), newRecipe)).id;
  set([...read(), { ...newRecipe, id }].sort((r1, r2) => r1.name.localeCompare(r2.name)));
  return id;
}

export async function updateRecipe(id: string, data: RecipeUpdate) {
  set(read().map((rec) => (rec.id === id ? { ...rec, ...data } : rec)));
  if (import.meta.env.DEV) return;
  await updateDoc(doc(getDb(), 'recipes', id), data);
}

export async function deleteRecipe(id: string) {
  set(read().filter((rec) => rec.id !== id));
  if (import.meta.env.DEV) return;
  await deleteDoc(doc(getDb(), 'recipes', id));
}

export async function createVariant(baseRecipe: Recipe): Promise<string> {
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
  const id = import.meta.env.DEV ? `rec-${Date.now()}` : (await addDoc(collection(getDb(), 'recipes'), variant)).id;
  set([...read(), { ...variant, id }].sort((r1, r2) => r1.name.localeCompare(r2.name)));
  return id;
}

export async function refreshRecipes() {
  if (import.meta.env.DEV) {
    set(MOCK_RECIPES);
    return;
  }
  const snap = await getDocs(query(collection(getDb(), 'recipes'), orderBy('name')));
  set(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Recipe));
}
