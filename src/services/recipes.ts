import { useState, useEffect } from 'react';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getDb } from './firebase';
import { createDevStore } from '../utils/dev-store';
import { MOCK_RECIPES } from '../constants/mock-data';
import type { Recipe, NewRecipe, RecipeUpdate } from '../types/recipe';

function recipesCol(uid: string) {
  return collection(getDb(), 'users', uid, 'recipes');
}

const devStore = createDevStore(MOCK_RECIPES);

export function useRecipes(uid: string | undefined) {
  const [recipes, setRecipes] = useState<Recipe[]>(import.meta.env.DEV ? devStore.getItems() : []);
  const [loading, setLoading] = useState(!import.meta.env.DEV);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) return devStore.subscribe(setRecipes);
    if (!uid) return;
    const q = query(recipesCol(uid), orderBy('name'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setRecipes(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Recipe));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [uid]);

  return { recipes, loading, error };
}

export async function createRecipe(uid: string, name: string): Promise<string> {
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
  const ref = await addDoc(recipesCol(uid), newRecipe);
  return ref.id;
}

export async function updateRecipe(uid: string, id: string, data: RecipeUpdate) {
  if (import.meta.env.DEV) {
    devStore.update(id, data);
    return;
  }
  await updateDoc(doc(getDb(), 'users', uid, 'recipes', id), data);
}

export async function deleteRecipe(uid: string, id: string) {
  if (import.meta.env.DEV) {
    devStore.remove(id);
    return;
  }
  await deleteDoc(doc(getDb(), 'users', uid, 'recipes', id));
}
