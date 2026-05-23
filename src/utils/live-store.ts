import { useSyncExternalStore } from 'react';
import { onSnapshot } from 'firebase/firestore';
import type { Query, DocumentData } from 'firebase/firestore';

interface Store<T> {
  getItems(): T[];
  getLoading(): boolean;
  getError(): string | null;
  subscribe(listener: () => void): () => void;
}

export function createLiveStore<T extends { id: string }>(q: Query<DocumentData>): Store<T> {
  let items: T[] = [];
  let loading = true;
  let error: string | null = null;
  let listeners: Array<() => void> = [];

  function notify() {
    listeners.forEach((fn) => fn());
  }

  onSnapshot(
    q,
    (snap) => {
      items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
      loading = false;
      notify();
    },
    (err) => {
      error = err.message;
      loading = false;
      notify();
    },
  );

  return {
    getItems: () => items,
    getLoading: () => loading,
    getError: () => error,
    subscribe(listener) {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((fn) => fn !== listener);
      };
    },
  };
}

export function useStore<T extends { id: string }>(store: Store<T>): { items: T[]; loading: boolean; error: string | null } {
  const items = useSyncExternalStore(store.subscribe, store.getItems);
  const loading = useSyncExternalStore(store.subscribe, store.getLoading);
  const error = useSyncExternalStore(store.subscribe, store.getError);
  return { items, loading, error };
}
