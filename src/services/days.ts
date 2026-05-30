import { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { getDb } from './firebase';

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

function saveDaysToLocalStorage(items: Day[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  notify?.(items);
}

let isDirty = false;

export async function syncDays(): Promise<void> {
  if (!isDirty) return;
  isDirty = false;
  const days = read();
  await Promise.all(days.map((day) => setDoc(doc(getDb(), 'days', day.id), { date: day.date, meals: day.meals }, { merge: false })));
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
  saveDaysToLocalStorage([{ id: date, date, meals: [] }, ...read()]);
}

export function updateDay(dayId: string, meals: Meal[]) {
  saveDaysToLocalStorage(read().map((day) => (day.id === dayId ? { ...day, meals } : day)));
  if (import.meta.env.DEV) return;
  isDirty = true;
}

export async function deleteDay(dayId: string) {
  saveDaysToLocalStorage(read().filter((day) => day.id !== dayId));
  if (import.meta.env.DEV) return;
  await deleteDoc(doc(getDb(), 'days', dayId));
}

export async function refreshDays() {
  if (import.meta.env.DEV) {
    saveDaysToLocalStorage([...MOCK_DAYS].sort((d1, d2) => d2.date.localeCompare(d1.date)));
    return;
  }
  const daysInFirestore = (await getDocs(query(collection(getDb(), 'days'), orderBy('date', 'desc')))).docs;
  saveDaysToLocalStorage(daysInFirestore.map((dayDoc) => ({ id: dayDoc.id, ...dayDoc.data() }) as Day));
}
