import { firestoreClient } from './firestore-client';
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
  if (!import.meta.env.DEV && !isDirty) return;
  isDirty = false;
  await Promise.all(readDays().map(({ id, date, meals }) => firestoreClient.setDocument('days', id, { date, meals })));
}

export function createDay(date: string): Day[] {
  const updated = [...readDays(), { id: date, date, meals: [] }];
  saveDays(updated);
  return updated;
}

export function updateDay(dayId: string, meals: Meal[]): Day[] {
  const updated = readDays().map((day) => (day.id === dayId ? { ...day, meals } : day));
  saveDays(updated);
  isDirty = true;
  return updated;
}

export async function deleteDay(dayId: string): Promise<Day[]> {
  const updated = readDays().filter((day) => day.id !== dayId);
  saveDays(updated);
  await firestoreClient.deleteDocument('days', dayId);
  return updated;
}

export async function refreshDays(): Promise<Day[]> {
  const docs = await firestoreClient.getAll('days', { orderByField: 'date', direction: 'desc' });
  const days = docs as unknown as Day[];
  saveDays(days);
  return days;
}

export async function refreshDaysIfNeeded(): Promise<Day[] | null> {
  if (import.meta.env.DEV || localStorage.getItem(KEY) !== null) return null;
  return refreshDays();
}
