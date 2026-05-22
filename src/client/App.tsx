import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './services/auth';
import Login from './components/Login';
import Layout from './components/Layout';
import IngredientsPage from './components/IngredientsPage';
import RecipesPage from './components/RecipesPage';
import RecipeDetail from './components/RecipeDetail';
import MealsPage from './components/MealsPage';
import DayDetail from './components/DayDetail';
import DashboardPage from './components/DashboardPage';
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
  const user = useAuth();

  if (user === undefined) {
    return <LoadingScreen />;
  }

  if (user === null) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout user={user} />}>
          <Route index element={<DashboardPage uid={user.uid} />} />
          <Route path="ingredients" element={<IngredientsPage uid={user.uid} />} />
          <Route path="recipes" element={<RecipesPage uid={user.uid} />} />
          <Route path="recipes/:recipeId" element={<RecipeDetail uid={user.uid} />} />
          <Route path="meals" element={<MealsPage uid={user.uid} />} />
          <Route path="meals/:dayId" element={<DayDetail uid={user.uid} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
