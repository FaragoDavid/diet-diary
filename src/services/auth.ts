import { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { getApp } from './firebase';

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
}

export function useAuth(): AppUser | null | undefined {
  const [user, setUser] = useState<AppUser | null | undefined>(undefined);

  useEffect(() => {
    if (import.meta.env.DEV) {
      setUser({ uid: 'dev-user', displayName: 'Dev User', email: 'dev@localhost' });
      return;
    }

    const auth = getAuth(getApp());
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(
        firebaseUser
          ? {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
            }
          : null,
      );
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
