import { format } from 'date-fns';

export function dateToParam(date: Date): string {
  return format(date, 'yyyyMMdd');
}

export function paramToDate(date: string): Date {
  return new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`);
}

export function dateToInput(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
