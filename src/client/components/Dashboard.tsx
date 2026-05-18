import { useState } from 'react';
import { signOut, useAuth } from '../services/auth';

export default function Dashboard() {
  const user = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Diet Diary</h1>
          <div className="flex items-center gap-4">
            {user && <span className="text-sm text-gray-600">{user.displayName || user.email}</span>}
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition duration-200"
            >
              {signingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8"></main>
    </div>
  );
}

