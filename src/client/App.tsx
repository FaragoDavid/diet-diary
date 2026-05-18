import { useAuth } from './services/auth';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const user = useAuth();

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (user === null) {
    return <Login />;
  }

  return <Dashboard />;
}
