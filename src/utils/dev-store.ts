export interface DevStore<T extends { id: string }> {
  getItems(): T[];
  getLoading(): boolean;
  getError(): string | null;
  subscribe(listener: () => void): () => void;
  add(item: T): void;
  update(id: string, data: Partial<T>): void;
  remove(id: string): void;
}

export function createDevStore<T extends { id: string }>(initialData: T[]): DevStore<T> {
  let items = [...initialData];
  let listeners: Array<() => void> = [];

  function notify() {
    listeners.forEach((fn) => fn());
  }

  return {
    getItems: () => items,
    getLoading: () => false,
    getError: () => null,
    subscribe(listener) {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((fn) => fn !== listener);
      };
    },
    add(item) {
      items = [...items, item];
      notify();
    },
    update(id, data) {
      items = items.map((i) => (i.id === id ? { ...i, ...data } : i));
      notify();
    },
    remove(id) {
      items = items.filter((i) => i.id !== id);
      notify();
    },
  };
}
