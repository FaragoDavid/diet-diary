import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getDb } from './firebase';
import { createDevStore } from '../utils/dev-store';
import { createLiveStore, useStore } from '../utils/live-store';
import { MOCK_RECIPES } from '../constants/mock-data';
import type { Recipe, RecipeUpdate } from '../types/recipe';

function recipesCol() {
  return collection(getDb(), 'recipes');
}

const devStore = createDevStore(MOCK_RECIPES);
const store = import.meta.env.DEV ? devStore : createLiveStore<Recipe>(query(recipesCol(), orderBy('name')));

export function useRecipes() {
  const { items, loading, error } = useStore(store);
  return { recipes: items, loading, error };
}

export async function createRecipe(name: string): Promise<string> {
  const newRecipe: Recipe = {
    id: `rec-${Date.now()}`,
    name,
    calories: 0,
    carbs: 0,
    fat: 0,
    amount: null,
    servings: 1,
    baseRecipeId: null,
    ingredients: [],
  };
  if (import.meta.env.DEV) {
    devStore.add(newRecipe);
    return newRecipe.id;
  }
  const ref = await addDoc(recipesCol(), newRecipe);
  return ref.id;
}

export async function updateRecipe(id: string, data: RecipeUpdate) {
  if (import.meta.env.DEV) {
    devStore.update(id, data);
    return;
  }
  await updateDoc(doc(getDb(), 'recipes', id), data);
}

export async function deleteRecipe(id: string) {
  if (import.meta.env.DEV) {
    devStore.remove(id);
    return;
  }
  await deleteDoc(doc(getDb(), 'recipes', id));
}

export async function createVariant(baseRecipe: Recipe): Promise<string> {
  const variant: Recipe = {
    id: `rec-${Date.now()}`,
    name: baseRecipe.name,
    calories: baseRecipe.calories,
    carbs: baseRecipe.carbs,
    fat: baseRecipe.fat,
    amount: baseRecipe.amount,
    servings: baseRecipe.servings,
    baseRecipeId: baseRecipe.baseRecipeId ?? baseRecipe.id,
    ingredients: [...baseRecipe.ingredients],
  };
  if (import.meta.env.DEV) {
    devStore.add(variant);
    return variant.id;
  }
  const ref = await addDoc(recipesCol(), variant);
  return ref.id;
}
