import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getDb } from './firebase';
import { createDevStore } from '../utils/dev-store';
import { createLiveStore, useStore } from '../utils/live-store';
import { MOCK_INGREDIENTS } from '../constants/mock-data';
import type { Ingredient, NewIngredient, IngredientUpdate } from '../types/ingredient';

function ingredientsCol() {
  return collection(getDb(), 'ingredients');
}

const devStore = createDevStore(MOCK_INGREDIENTS);
const store = import.meta.env.DEV ? devStore : createLiveStore<Ingredient>(query(ingredientsCol(), orderBy('name')));

export function useIngredients() {
  const { items, loading, error } = useStore(store);
  return { ingredients: items, loading, error };
}

export async function createIngredient(data: NewIngredient) {
  if (import.meta.env.DEV) {
    devStore.add({ ...data, id: `ing-${Date.now()}` });
    return;
  }
  await addDoc(ingredientsCol(), data);
}

export async function updateIngredient(id: string, data: IngredientUpdate) {
  if (import.meta.env.DEV) {
    devStore.update(id, data);
    return;
  }
  await updateDoc(doc(getDb(), 'ingredients', id), data);
}

export async function deleteIngredient(id: string) {
  if (import.meta.env.DEV) {
    devStore.remove(id);
    return;
  }
  await deleteDoc(doc(getDb(), 'ingredients', id));
}
