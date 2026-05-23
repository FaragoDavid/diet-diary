import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'diet-diary-314bd.firebaseapp.com',
  projectId: 'diet-diary-314bd',
  storageBucket: 'diet-diary-314bd.firebasestorage.app',
  messagingSenderId: '561494276242',
  appId: '1:561494276242:web:254b2da1d6263fb4040e4b',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function getDb() {
  return db;
}

export function getApp() {
  return app;
}
