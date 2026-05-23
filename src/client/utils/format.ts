export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
}
