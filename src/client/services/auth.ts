import { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { getApp } from './firebase';

export function useAuth() {
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    if (import.meta.env.DEV) {
      setUser({ displayName: 'Dev User', email: 'dev@localhost' });
      return;
    }

    const auth = getAuth(getApp());
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  return user;
}

export async function signIn() {
  const auth = getAuth(getApp());
  await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function signOut() {
  const auth = getAuth(getApp());
  await firebaseSignOut(auth);
}
