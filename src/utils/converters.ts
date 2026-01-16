import { format } from 'date-fns';

export function dateToParam(date: Date): string {
  return format(date, 'yyyyMMdd');
}

export function paramToDate(date: string): Date {
  if (!date || date.length !== 8 || !/^\d{8}$/.test(date)) {
    throw new Error('Invalid date format. Expected YYYYMMDD');
  }

  const parsed = new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`);

  if (isNaN(parsed.getTime())) {
    throw new Error('Invalid date value');
  }

  return parsed;
}

export function dateToInput(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
