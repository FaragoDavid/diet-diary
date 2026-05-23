import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { UtensilsCrossed, Leaf, LogOut, Calendar, LayoutDashboard } from 'lucide-react';
import { signOut, type AppUser } from '../services/auth';
import { TEXTS } from '../constants/texts';

const navItems = [
  { to: '/', label: TEXTS.nav.dashboard, icon: LayoutDashboard },
  { to: '/ingredients', label: TEXTS.nav.ingredients, icon: Leaf },
  { to: '/recipes', label: TEXTS.nav.recipes, icon: UtensilsCrossed },
  { to: '/meals', label: TEXTS.nav.meals, icon: Calendar },
];

export default function Layout({ user }: { user: AppUser }) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <nav className="navbar bg-base-100 shadow-sm px-4 sticky top-0 z-20">
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
        <div className="flex-none flex items-center gap-3 ml-2">
          <span className="text-sm text-base-content/70 hidden sm:inline">{user.displayName || user.email}</span>
          <button onClick={handleSignOut} disabled={signingOut} className="btn btn-sm btn-ghost">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
