import { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getDb } from './firebase';
import { createDevStore } from '../utils/dev-store';
import { MOCK_DAYS } from '../constants/mock-data';
import type { Day, Meal } from '../types/day';

function daysCol() {
  return collection(getDb(), 'days');
}

const devStore = createDevStore(MOCK_DAYS);

function sortedDesc(items: Day[]): Day[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

export function useDays() {
  const [days, setDays] = useState<Day[]>(import.meta.env.DEV ? sortedDesc(devStore.getItems()) : []);
  const [loading, setLoading] = useState(!import.meta.env.DEV);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) return devStore.subscribe((items) => setDays(sortedDesc(items)));
    const q = query(daysCol(), orderBy('date', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setDays(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Day));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  return { days, loading, error };
}

export async function createDay(date: string) {
  if (import.meta.env.DEV) {
    devStore.add({ id: date, date, meals: [] });
    return;
  }
  const ref = doc(daysCol(), date);
  await setDoc(ref, { date, meals: [] });
}

export async function updateDay(dayId: string, meals: Meal[]) {
  if (import.meta.env.DEV) {
    devStore.update(dayId, { meals } as Partial<Day>);
    return;
  }
  await setDoc(doc(getDb(), 'days', dayId), { date: dayId, meals }, { merge: false });
}

export async function deleteDay(dayId: string) {
  if (import.meta.env.DEV) {
    devStore.remove(dayId);
    return;
  }
  await deleteDoc(doc(getDb(), 'days', dayId));
}
