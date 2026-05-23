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
