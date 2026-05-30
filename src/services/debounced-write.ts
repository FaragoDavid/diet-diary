import { WRITE_DEBOUNCE_MS } from '../constants/config';

interface PendingWrite {
  writeFn: () => Promise<void>;
  timer: ReturnType<typeof setTimeout>;
}

const pendingWrites = new Map<string, PendingWrite>();

export function debouncedWrite(key: string, writeFn: () => Promise<void>): void {
  const existing = pendingWrites.get(key);
  if (existing) clearTimeout(existing.timer);

  const timer = setTimeout(() => {
    pendingWrites.delete(key);
    writeFn();
  }, WRITE_DEBOUNCE_MS);

  pendingWrites.set(key, { writeFn, timer });
}

export function cancelWrite(key: string): void {
  const existing = pendingWrites.get(key);
  if (existing) {
    clearTimeout(existing.timer);
    pendingWrites.delete(key);
  }
}

export async function flushAllWrites(): Promise<void> {
  const writes = [...pendingWrites.values()];
  for (const { timer } of writes) clearTimeout(timer);
  pendingWrites.clear();
  await Promise.all(writes.map(({ writeFn }) => writeFn()));
}

window.addEventListener('beforeunload', () => flushAllWrites());
