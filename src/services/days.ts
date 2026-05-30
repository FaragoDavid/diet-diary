import { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { getDb } from './firebase';
import { debouncedWrite, cancelWrite } from './debounced-write';
import { MOCK_DAYS } from '../constants/mock-data';
import type { Day, Meal } from '../types/day';

const KEY = 'days';

if (import.meta.env.DEV && !localStorage.getItem(KEY)) {
  localStorage.setItem(KEY, JSON.stringify([...MOCK_DAYS].sort((d1, d2) => d2.date.localeCompare(d1.date))));
}

let notify: ((items: Day[]) => void) | null = null;

function read(): Day[] {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

function set(items: Day[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  notify?.(items);
}

export function useDays() {
  const [days, setDays] = useState<Day[]>(read);
  notify = setDays;
  useEffect(() => {
    if (!import.meta.env.DEV && localStorage.getItem(KEY) === null) {
      refreshDays();
    }
  }, []);
  return { days };
}

export function createDay(date: string) {
  set([{ id: date, date, meals: [] }, ...read()]);
}

export function updateDay(dayId: string, meals: Meal[]) {
  set(read().map((day) => (day.id === dayId ? { ...day, meals } : day)));
  if (import.meta.env.DEV) return;
  debouncedWrite(`days/${dayId}`, () => setDoc(doc(getDb(), 'days', dayId), { date: dayId, meals }, { merge: false }));
}

export async function deleteDay(dayId: string) {
  cancelWrite(`days/${dayId}`);
  set(read().filter((day) => day.id !== dayId));
  if (import.meta.env.DEV) return;
  await deleteDoc(doc(getDb(), 'days', dayId));
}

export async function refreshDays() {
  if (import.meta.env.DEV) {
    set([...MOCK_DAYS].sort((d1, d2) => d2.date.localeCompare(d1.date)));
    return;
  }
  const snap = await getDocs(query(collection(getDb(), 'days'), orderBy('date', 'desc')));
  set(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Day));
}
