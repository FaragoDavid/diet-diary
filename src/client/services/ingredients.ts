import { useState, useEffect, useCallback } from 'react';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getDb } from './firebase';
import { MOCK_INGREDIENTS } from './mock-data';
import type { Ingredient, NewIngredient, IngredientUpdate } from '../types/ingredient';

function ingredientsCol(uid: string) {
  return collection(getDb(), 'users', uid, 'ingredients');
}

let devIngredients = [...MOCK_INGREDIENTS];
let devListeners: Array<(items: Ingredient[]) => void> = [];

function notifyDevListeners() {
  devListeners.forEach((fn) => fn([...devIngredients]));
}

export function useIngredients(uid: string | undefined) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(import.meta.env.DEV ? devIngredients : []);
  const [loading, setLoading] = useState(!import.meta.env.DEV);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      devListeners.push(setIngredients);
      return () => {
        devListeners = devListeners.filter((fn) => fn !== setIngredients);
      };
    }
    if (!uid) return;
    const q = query(ingredientsCol(uid), orderBy('name'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setIngredients(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Ingredient));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [uid]);

  return { ingredients, loading, error };
}

export async function createIngredient(uid: string, data: NewIngredient) {
  if (import.meta.env.DEV) {
    devIngredients = [...devIngredients, { ...data, id: `ing-${Date.now()}` }];
    notifyDevListeners();
    return;
  }
  await addDoc(ingredientsCol(uid), data);
}

export async function updateIngredient(uid: string, id: string, data: IngredientUpdate) {
  if (import.meta.env.DEV) {
    devIngredients = devIngredients.map((ing) => (ing.id === id ? { ...ing, ...data } : ing));
    notifyDevListeners();
    return;
  }
  await updateDoc(doc(getDb(), 'users', uid, 'ingredients', id), data);
}

export async function deleteIngredient(uid: string, id: string) {
  if (import.meta.env.DEV) {
    devIngredients = devIngredients.filter((ing) => ing.id !== id);
    notifyDevListeners();
    return;
  }
  await deleteDoc(doc(getDb(), 'users', uid, 'ingredients', id));
}
