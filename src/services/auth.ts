import { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getApp } from './firebase';

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');

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

function storeAccessToken(accessToken: string | undefined) {
  if (accessToken) {
    sessionStorage.setItem('driveAccessToken', accessToken);
  }
}

export async function signIn() {
  const auth = getAuth(getApp());
  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  storeAccessToken(credential?.accessToken);
}

export function getAccessToken(): string | null {
  return sessionStorage.getItem('driveAccessToken');
}

export async function refreshAccessToken(): Promise<string | null> {
  const auth = getAuth(getApp());
  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  storeAccessToken(credential?.accessToken);
  return credential?.accessToken ?? null;
}
