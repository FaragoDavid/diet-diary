import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { UtensilsCrossed, Leaf, Calendar, RefreshCw, Image, Upload } from 'lucide-react';
import { isDriveEnabled } from '../services/drive';
import { refreshIngredients, syncIngredients } from '../services/ingredients';
import { refreshRecipes, syncRecipes } from '../services/recipes';
import { refreshDays, syncDays } from '../services/days';
import { TEXTS } from '../constants/texts';

const navItems = [
  { to: '/', label: TEXTS.nav.meals, icon: Calendar },
  { to: '/recipes', label: TEXTS.nav.recipes, icon: UtensilsCrossed },
  ...(isDriveEnabled ? [{ to: '/gallery', label: TEXTS.nav.gallery, icon: Image }] : []),
  { to: '/ingredients', label: TEXTS.nav.ingredients, icon: Leaf },
];

export default function Layout() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [syncing, setSyncing] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  const handleUpload = async () => {
    setSyncing(true);
    try {
      await Promise.all([syncDays(), syncRecipes(), syncIngredients()]);
      showToast(TEXTS.upload.success, 'success');
    } catch {
      showToast(TEXTS.upload.error, 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleRefresh = async () => {
    setSyncing(true);
    try {
      await Promise.all([refreshIngredients(), refreshRecipes(), refreshDays()]);
      showToast(TEXTS.refresh.success, 'success');
    } catch {
      showToast(TEXTS.refresh.error, 'error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-base-200">
      {syncing && (
        <div data-testid="sync-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-base-200/60">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
        </div>
      )}
      <nav className="navbar bg-base-100 shadow-sm px-4">
        <div className="flex-1">
          <span className="text-2xl font-bold">{TEXTS.app.title}</span>
        </div>
        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}>
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="flex-none ml-2">
          <button onClick={handleUpload} data-testid="upload-button" className="btn btn-sm btn-ghost">
            <Upload className="w-4 h-4" />
          </button>
          <button onClick={handleRefresh} data-testid="refresh-button" className="btn btn-sm btn-ghost">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </nav>
      <main className="flex-1 min-h-0 max-w-7xl w-full mx-auto px-4 py-4 flex flex-col">
        <Outlet />
      </main>
      {toast && (
        <div className="toast toast-top toast-center z-50">
          <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
