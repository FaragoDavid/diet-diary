import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { useDays, createDay, deleteDay } from '../services/days';
import { round } from '../utils/nutrition';
import { TEXTS } from '../constants/texts';
import type { Day } from '../types/day';

export default function MealsPage({ uid }: { uid: string }) {
  const { days, loading, error } = useDays(uid);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    setCreating(true);
    try {
      await createDay(uid, newDate);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (dayId: string) => {
    setDeletingId(dayId);
    await deleteDay(uid, dayId);
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>
          {TEXTS.meals.loadError}: {error}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{TEXTS.nav.meals}</h2>

      <form onSubmit={handleCreate} className="flex gap-2 items-end">
        <div className="form-control">
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="input input-bordered" />
        </div>
        <button type="submit" disabled={creating || !newDate} className="btn btn-primary">
          <Plus className="w-4 h-4" /> {TEXTS.meals.newDay}
        </button>
      </form>

      {days.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">{TEXTS.meals.noDays}</div>
      ) : (
        <div className="grid gap-3">
          {days.map((day) => (
            <DayCard key={day.id} day={day} onDelete={() => handleDelete(day.id)} deleting={deletingId === day.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function DayCard({ day, onDelete, deleting }: { day: Day; onDelete: () => void; deleting: boolean }) {
  const totals = day.meals.reduce(
    (acc, meal) => {
      meal.dishes.forEach((d) => {
        acc.calories += d.calories;
        acc.carbs += d.carbs;
        acc.fat += d.fat;
      });
      return acc;
    },
    { calories: 0, carbs: 0, fat: 0 },
  );
  const dishCount = day.meals.reduce((sum, m) => sum + m.dishes.length, 0);

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4 flex-row items-center justify-between">
        <div>
          <Link to={`/meals/${day.id}`} className="card-title text-base link link-hover gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(day.date)}
          </Link>
          <div className="text-sm text-base-content/60 mt-1">
            {round(totals.calories)} {TEXTS.nutrients.cal.toLowerCase()} · {round(totals.carbs)}g {TEXTS.nutrients.ch.toLowerCase()} ·{' '}
            {round(totals.fat)}g {TEXTS.nutrients.fat.toLowerCase()}
            {dishCount > 0 && (
              <span>
                {' '}
                · {day.meals.length} {TEXTS.dashboard.mealsCount.toLowerCase()} · {dishCount} {TEXTS.dashboard.dishesCount.toLowerCase()}
              </span>
            )}
          </div>
        </div>
        <button onClick={onDelete} disabled={deleting} className="btn btn-ghost btn-sm text-error">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
}
