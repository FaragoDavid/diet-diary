import { useAuth } from './services/auth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <p className="text-gray-600 font-medium">Loading Diet Diary...</p>
      </div>
    </div>
  );
}

export default function App() {
  const user = useAuth();

  if (user === undefined) {
    return <LoadingScreen />;
  }

  if (user === null) {
    return <Login />;
  }

  return <Dashboard />;
}

