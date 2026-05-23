import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './services/auth';
import Login from './components/Login';
import Layout from './components/Layout';
import IngredientsPage from './components/IngredientsPage';
import RecipesPage from './components/RecipesPage';
import MealsPage from './components/MealsPage';
import DayDetail from './components/DayDetail';
import { TEXTS } from './constants/texts';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <p className="text-gray-600 font-medium">{TEXTS.app.loading}</p>
      </div>
    </div>
  );
}

export default function App() {
  const loggedIn = useAuth();

  if (loggedIn === undefined) {
    return <LoadingScreen />;
  }

  if (!loggedIn) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<MealsPage />} />
          <Route path="meals" element={<MealsPage />} />
          <Route path="meals/:dayId" element={<DayDetail />} />
          <Route path="ingredients" element={<IngredientsPage />} />
          <Route path="recipes" element={<RecipesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
