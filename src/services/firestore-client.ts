import { collection, doc, setDoc, deleteDoc, query, orderBy, getDocs } from 'firebase/firestore';
import type { OrderByDirection } from 'firebase/firestore';
import { getDb } from './firebase';

type DocumentData = Record<string, unknown>;

interface GetAllConfig {
  orderByField: string;
  direction?: OrderByDirection;
}

export class FirestoreClient {
  async getAll(collectionName: string, { orderByField, direction = 'asc' }: GetAllConfig): Promise<Array<DocumentData>> {
    const snapshot = await getDocs(query(collection(getDb(), collectionName), orderBy(orderByField, direction)));
    return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));
  }

  async setDocument(collectionName: string, docId: string, data: object): Promise<void> {
    await setDoc(doc(getDb(), collectionName, docId), data as DocumentData);
  }

  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    await deleteDoc(doc(getDb(), collectionName, docId));
  }

  generateId(collectionName: string): string {
    return doc(collection(getDb(), collectionName)).id;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class DevFirestoreClient extends FirestoreClient {
  override async getAll(collectionName: string): Promise<Array<DocumentData>> {
    await delay(500);
    const stored = localStorage.getItem(collectionName);
    return stored ? JSON.parse(stored) : [];
  }

  override async setDocument(): Promise<void> {
    await delay(500);
  }

  override async deleteDocument(): Promise<void> {
    await delay(300);
  }

  override generateId(collectionName: string): string {
    const prefixes: Record<string, string> = { recipes: 'rec', ingredients: 'ing', days: 'day' };
    return `${prefixes[collectionName] ?? collectionName}-${Date.now()}`;
  }
}

export const firestoreClient: FirestoreClient = import.meta.env.DEV ? new DevFirestoreClient() : new FirestoreClient();
