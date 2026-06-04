import { firestoreClient } from './firestore-client';
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
  if (!import.meta.env.DEV && !isDirty) return;
  isDirty = false;
  await Promise.all(readIngredients().map((ingredient) => firestoreClient.setDocument('ingredients', ingredient.id, ingredient)));
}

export function createIngredient(data: NewIngredient): Ingredient[] {
  const id = firestoreClient.generateId('ingredients');
  const updated = [...readIngredients(), { ...data, id } as Ingredient];
  saveIngredients(updated);
  isDirty = true;
  return updated;
}

export function updateIngredient(id: string, data: IngredientUpdate): Ingredient[] {
  const updated = readIngredients().map((ing) => (ing.id === id ? { ...ing, ...data } : ing));
  saveIngredients(updated);
  isDirty = true;
  return updated;
}

export async function deleteIngredient(id: string): Promise<Ingredient[]> {
  const updated = readIngredients().filter((ing) => ing.id !== id);
  saveIngredients(updated);
  await firestoreClient.deleteDocument('ingredients', id);
  return updated;
}

export async function refreshIngredients(): Promise<Ingredient[]> {
  const docs = await firestoreClient.getAll('ingredients', { orderByField: 'name' });
  const ingredients = docs as unknown as Ingredient[];
  saveIngredients(ingredients);
  return ingredients;
}

export async function refreshIngredientsIfNeeded(): Promise<Ingredient[] | null> {
  if (import.meta.env.DEV || localStorage.getItem(KEY) !== null) return null;
  return refreshIngredients();
}
