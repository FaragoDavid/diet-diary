import { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { getApp } from './firebase';

export function useAuth(): boolean | undefined {
  const [loggedIn, setLoggedIn] = useState<boolean | undefined>(import.meta.env.DEV ? true : undefined);

  useEffect(() => {
    if (import.meta.env.DEV) return;

    const auth = getAuth(getApp());
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoggedIn(firebaseUser !== null);
    });

    return () => unsubscribe();
  }, []);

  return loggedIn;
}

export async function signIn() {
  const auth = getAuth(getApp());
  await signInWithRedirect(auth, new GoogleAuthProvider());
}

export async function signOut() {
  const auth = getAuth(getApp());
  await firebaseSignOut(auth);
}
