import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { UtensilsCrossed, Leaf, LogOut, Calendar, RefreshCw } from 'lucide-react';
import { signOut } from '../services/auth';
import { refreshIngredients } from '../services/ingredients';
import { refreshRecipes } from '../services/recipes';
import { refreshDays } from '../services/days';
import { TEXTS } from '../constants/texts';

const navItems = [
  { to: '/', label: TEXTS.nav.meals, icon: Calendar },
  { to: '/recipes', label: TEXTS.nav.recipes, icon: UtensilsCrossed },
  { to: '/ingredients', label: TEXTS.nav.ingredients, icon: Leaf },
];

export default function Layout() {
  const [signingOut, setSigningOut] = useState(false);

  const handleRefresh = () => {
    refreshIngredients();
    refreshRecipes();
    refreshDays();
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-base-200">
      <nav className="navbar bg-base-100 shadow-sm px-4">
        <div className="flex-1">
          <span className="text-xl font-bold">{TEXTS.app.title}</span>
        </div>
        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="flex-none ml-2 flex items-center gap-1">
          <button onClick={handleRefresh} className="btn btn-sm btn-ghost">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={handleSignOut} disabled={signingOut} className="btn btn-sm btn-ghost">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>
      <main className="flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 py-4 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
