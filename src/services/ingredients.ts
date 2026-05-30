import { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { getDb } from './firebase';

import { MOCK_INGREDIENTS } from '../constants/mock-data';
import type { Ingredient, NewIngredient, IngredientUpdate } from '../types/ingredient';

const INGREDIENTS_LOCALSTORAGE_KEY = 'ingredients';

if (import.meta.env.DEV && !localStorage.getItem(INGREDIENTS_LOCALSTORAGE_KEY)) {
  localStorage.setItem(INGREDIENTS_LOCALSTORAGE_KEY, JSON.stringify(MOCK_INGREDIENTS));
}

let notify: ((items: Ingredient[]) => void) | null = null;

function read(): Ingredient[] {
  return JSON.parse(localStorage.getItem(INGREDIENTS_LOCALSTORAGE_KEY) || '[]');
}

function saveIngredientsToLocalStorage(ingredients: Ingredient[]) {
  localStorage.setItem(INGREDIENTS_LOCALSTORAGE_KEY, JSON.stringify(ingredients));
  notify?.(ingredients);
}

let isDirty = false;

export async function syncIngredients(): Promise<void> {
  if (!isDirty) return;
  isDirty = false;
  const ingredients = read();
  await Promise.all(ingredients.map((ingredient) => setDoc(doc(getDb(), 'ingredients', ingredient.id), ingredient)));
}

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(read);
  notify = setIngredients;
  useEffect(() => {
    if (!import.meta.env.DEV && localStorage.getItem(INGREDIENTS_LOCALSTORAGE_KEY) === null) {
      refreshIngredients();
    }
  }, []);
  return { ingredients };
}

export function createIngredient(data: NewIngredient) {
  const id = import.meta.env.DEV ? `ing-${Date.now()}` : doc(collection(getDb(), 'ingredients')).id;
  saveIngredientsToLocalStorage([...read(), { ...data, id } as Ingredient].sort((i1, i2) => i1.name.localeCompare(i2.name)));
  if (!import.meta.env.DEV) isDirty = true;
}

export function updateIngredient(id: string, data: IngredientUpdate) {
  saveIngredientsToLocalStorage(read().map((ing) => (ing.id === id ? { ...ing, ...data } : ing)));
  if (import.meta.env.DEV) return;
  isDirty = true;
}

export async function deleteIngredient(id: string) {
  saveIngredientsToLocalStorage(read().filter((ing) => ing.id !== id));
  if (import.meta.env.DEV) return;
  await deleteDoc(doc(getDb(), 'ingredients', id));
}

export async function refreshIngredients() {
  if (import.meta.env.DEV) {
    saveIngredientsToLocalStorage(MOCK_INGREDIENTS);
    return;
  }
  const ingredientsInFirestore = (await getDocs(query(collection(getDb(), 'ingredients'), orderBy('name')))).docs;
  saveIngredientsToLocalStorage(
    ingredientsInFirestore.map((ingredientDoc) => ({ id: ingredientDoc.id, ...ingredientDoc.data() }) as Ingredient),
  );
}
