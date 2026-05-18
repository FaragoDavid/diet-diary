import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'diet-diary-ca28e.firebaseapp.com',
  projectId: 'diet-diary-ca28e',
  storageBucket: 'diet-diary-ca28e.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function getDb() {
  return db;
}

export function getApp() {
  return app;
}
