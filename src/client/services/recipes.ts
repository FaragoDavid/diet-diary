import { useState, useEffect } from 'react';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getDb } from './firebase';
import { MOCK_RECIPES } from './mock-data';
import type { Recipe, NewRecipe, RecipeUpdate } from '../types/recipe';

function recipesCol(uid: string) {
  return collection(getDb(), 'users', uid, 'recipes');
}

export function useRecipes(uid: string | undefined) {
  const [recipes, setRecipes] = useState<Recipe[]>(import.meta.env.DEV ? MOCK_RECIPES : []);
  const [loading, setLoading] = useState(!import.meta.env.DEV);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV || !uid) return;
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
  if (import.meta.env.DEV) return 'mock-id';
  const newRecipe: Omit<NewRecipe, 'id'> = {
    name,
    calories: 0,
    carbs: 0,
    fat: 0,
    amount: null,
    servings: 1,
    baseRecipeId: null,
    ingredients: [],
  };
  const ref = await addDoc(recipesCol(uid), newRecipe);
  return ref.id;
}

export async function updateRecipe(uid: string, id: string, data: RecipeUpdate) {
  if (import.meta.env.DEV) return;
  await updateDoc(doc(getDb(), 'users', uid, 'recipes', id), data);
}

export async function deleteRecipe(uid: string, id: string) {
  if (import.meta.env.DEV) return;
  await deleteDoc(doc(getDb(), 'users', uid, 'recipes', id));
}
