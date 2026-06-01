import { collection, doc, setDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { getDb } from './firebase';

import { MOCK_DAYS } from '../constants/mock-data';
import type { Day, Meal } from '../types/day';

const KEY = 'days';

if (import.meta.env.DEV && !localStorage.getItem(KEY)) {
  localStorage.setItem(KEY, JSON.stringify([...MOCK_DAYS].sort((d1, d2) => d2.date.localeCompare(d1.date))));
}

let isDirty = false;

function saveDays(days: Day[]): void {
  localStorage.setItem(KEY, JSON.stringify(days));
}

export function readDays(): Day[] {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

export async function syncDays(): Promise<void> {
  if (!isDirty) return;
  isDirty = false;
  const days = readDays();
  await Promise.all(days.map((day) => setDoc(doc(getDb(), 'days', day.id), { date: day.date, meals: day.meals }, { merge: false })));
}

export function createDay(date: string): Day[] {
  const updated = [{ id: date, date, meals: [] }, ...readDays()];
  saveDays(updated);
  return updated;
}

export function updateDay(dayId: string, meals: Meal[]): Day[] {
  const updated = readDays().map((day) => (day.id === dayId ? { ...day, meals } : day));
  saveDays(updated);
  if (!import.meta.env.DEV) isDirty = true;
  return updated;
}

export async function deleteDay(dayId: string): Promise<Day[]> {
  const updated = readDays().filter((day) => day.id !== dayId);
  saveDays(updated);
  if (!import.meta.env.DEV) {
    await deleteDoc(doc(getDb(), 'days', dayId));
  }
  return updated;
}

export async function refreshDays(): Promise<Day[]> {
  if (import.meta.env.DEV) {
    const days = [...MOCK_DAYS].sort((d1, d2) => d2.date.localeCompare(d1.date));
    saveDays(days);
    return days;
  }
  const daysInFirestore = (await getDocs(query(collection(getDb(), 'days'), orderBy('date', 'desc')))).docs;
  const days = daysInFirestore.map((dayDoc) => ({ id: dayDoc.id, ...dayDoc.data() }) as Day);
  saveDays(days);
  return days;
}

export async function refreshDaysIfNeeded(): Promise<Day[] | null> {
  if (import.meta.env.DEV || localStorage.getItem(KEY) !== null) return null;
  return refreshDays();
}
