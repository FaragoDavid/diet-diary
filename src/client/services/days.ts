import { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getDb } from './firebase';
import type { Day, Meal } from '../types/day';

function daysCol(uid: string) {
  return collection(getDb(), 'users', uid, 'days');
}

export function useDays(uid: string | undefined) {
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;
    const q = query(daysCol(uid), orderBy('date', 'desc'));
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
  }, [uid]);

  return { days, loading, error };
}

export async function createDay(uid: string, date: string) {
  const ref = doc(daysCol(uid), date);
  await setDoc(ref, { date, meals: [] });
}

export async function updateDay(uid: string, dayId: string, meals: Meal[]) {
  await setDoc(doc(getDb(), 'users', uid, 'days', dayId), { date: dayId, meals }, { merge: false });
}

export async function deleteDay(uid: string, dayId: string) {
  await deleteDoc(doc(getDb(), 'users', uid, 'days', dayId));
}
