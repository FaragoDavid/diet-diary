import { useState, useEffect } from 'react';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
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

function set(items: Ingredient[]) {
  localStorage.setItem(INGREDIENTS_LOCALSTORAGE_KEY, JSON.stringify(items));
  notify?.(items);
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

export async function createIngredient(data: NewIngredient) {
  const id = import.meta.env.DEV ? `ing-${Date.now()}` : (await addDoc(collection(getDb(), 'ingredients'), data)).id;
  set([...read(), { ...data, id } as Ingredient].sort((i1, i2) => i1.name.localeCompare(i2.name)));
}

export async function updateIngredient(id: string, data: IngredientUpdate) {
  set(read().map((ing) => (ing.id === id ? { ...ing, ...data } : ing)));
  if (import.meta.env.DEV) return;
  await updateDoc(doc(getDb(), 'ingredients', id), data);
}

export async function deleteIngredient(id: string) {
  set(read().filter((ing) => ing.id !== id));
  if (import.meta.env.DEV) return;
  await deleteDoc(doc(getDb(), 'ingredients', id));
}

export async function refreshIngredients() {
  if (import.meta.env.DEV) {
    set(MOCK_INGREDIENTS);
    return;
  }
  const snap = await getDocs(query(collection(getDb(), 'ingredients'), orderBy('name')));
  set(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Ingredient));
}
