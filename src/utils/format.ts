import { TEXTS } from '../constants/texts';

export function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function formatNutrition(values: { calories: number; carbs: number; fat: number }): string {
  return `${round(values.calories)} ${TEXTS.nutrients.kcalUnit} · ${round(values.carbs)}g ${TEXTS.nutrients.chUnit} · ${round(values.fat)}g ${TEXTS.nutrients.fatUnit}`;
}

export function getNutrientColor(actual: number, target: number | undefined): string {
  if (!target) return '';
  const deviation = Math.abs(actual - target) / target;
  if (deviation > 0.2) return 'text-error';
  if (deviation > 0.1) return 'text-warning';
  return '';
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const month = d.toLocaleDateString('hu-HU', { month: 'short' });
  const day = d.getDate();
  const weekday = d.toLocaleDateString('hu-HU', { weekday: 'short' });
  return `${month} ${day} (${weekday})`;
}
