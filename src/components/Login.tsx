import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { signIn } from '../services/auth';
import { GoogleIcon } from './icons/GoogleIcon';
import { TEXTS } from '../constants/texts';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : TEXTS.auth.signInFailed);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">{TEXTS.app.title}</h1>

        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {TEXTS.auth.signingIn}
            </>
          ) : (
            <>
              <GoogleIcon className="w-5 h-5" />
              {TEXTS.auth.signIn}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
