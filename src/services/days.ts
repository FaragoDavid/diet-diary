import { collection, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { getDb } from './firebase';
import { createDevStore } from '../utils/dev-store';
import { createLiveStore, useStore } from '../utils/live-store';
import { MOCK_DAYS } from '../constants/mock-data';
import type { Day, Meal } from '../types/day';

function daysCol() {
  return collection(getDb(), 'days');
}

const devStore = createDevStore([...MOCK_DAYS].sort((a, b) => b.date.localeCompare(a.date)));
const store = import.meta.env.DEV ? devStore : createLiveStore<Day>(query(daysCol(), orderBy('date', 'desc')));

export function useDays() {
  const { items, loading, error } = useStore(store);
  return { days: items, loading, error };
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
