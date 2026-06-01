import { collection, doc, setDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { getDb } from './firebase';

import { MOCK_INGREDIENTS } from '../constants/mock-data';
import type { Ingredient, NewIngredient, IngredientUpdate } from '../types/ingredient';

const KEY = 'ingredients';

if (import.meta.env.DEV && !localStorage.getItem(KEY)) {
  localStorage.setItem(KEY, JSON.stringify(MOCK_INGREDIENTS));
}

let isDirty = false;

function saveIngredients(ingredients: Ingredient[]): void {
  localStorage.setItem(KEY, JSON.stringify(ingredients));
}

export function readIngredients(): Ingredient[] {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

export async function syncIngredients(): Promise<void> {
  if (!isDirty) return;
  isDirty = false;
  const ingredients = readIngredients();
  await Promise.all(ingredients.map((ingredient) => setDoc(doc(getDb(), 'ingredients', ingredient.id), ingredient)));
}

export function createIngredient(data: NewIngredient): Ingredient[] {
  const id = import.meta.env.DEV ? `ing-${Date.now()}` : doc(collection(getDb(), 'ingredients')).id;
  const updated = [...readIngredients(), { ...data, id } as Ingredient].sort((i1, i2) => i1.name.localeCompare(i2.name));
  saveIngredients(updated);
  if (!import.meta.env.DEV) isDirty = true;
  return updated;
}

export function updateIngredient(id: string, data: IngredientUpdate): Ingredient[] {
  const updated = readIngredients().map((ing) => (ing.id === id ? { ...ing, ...data } : ing));
  saveIngredients(updated);
  if (!import.meta.env.DEV) isDirty = true;
  return updated;
}

export async function deleteIngredient(id: string): Promise<Ingredient[]> {
  const updated = readIngredients().filter((ing) => ing.id !== id);
  saveIngredients(updated);
  if (!import.meta.env.DEV) {
    await deleteDoc(doc(getDb(), 'ingredients', id));
  }
  return updated;
}

export async function refreshIngredients(): Promise<Ingredient[]> {
  if (import.meta.env.DEV) {
    saveIngredients(MOCK_INGREDIENTS);
    return MOCK_INGREDIENTS;
  }
  const ingredientsInFirestore = (await getDocs(query(collection(getDb(), 'ingredients'), orderBy('name')))).docs;
  const ingredients = ingredientsInFirestore.map((ingredientDoc) => ({ id: ingredientDoc.id, ...ingredientDoc.data() }) as Ingredient);
  saveIngredients(ingredients);
  return ingredients;
}

export async function refreshIngredientsIfNeeded(): Promise<Ingredient[] | null> {
  if (import.meta.env.DEV || localStorage.getItem(KEY) !== null) return null;
  return refreshIngredients();
}
