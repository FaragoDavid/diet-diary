import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { useDays, createDay, deleteDay } from '../services/days';
import { round } from '../utils/nutrition';
import { formatDate } from '../utils/format';
import { DAY_TARGETS } from '../constants/meal-targets';
import { TEXTS } from '../constants/texts';
import type { Day } from '../types/day';

export default function MealsPage({ uid }: { uid: string }) {
  const { days, loading, error } = useDays(uid);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreate = async () => {
    setCreating(true);
    try {
      const existingDates = new Set(days.map((d) => d.date));
      const date = new Date();
      while (existingDates.has(date.toISOString().slice(0, 10))) {
        date.setDate(date.getDate() + 1);
      }
      const dateStr = date.toISOString().slice(0, 10);
      await createDay(uid, dateStr);
      navigate(`/meals/${dateStr}`);
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{TEXTS.nav.meals}</h2>
        <button onClick={handleCreate} disabled={creating} className="btn btn-primary btn-sm">
          <Plus className="w-4 h-4" /> {TEXTS.meals.newDay}
        </button>
      </div>

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
    <Link to={`/meals/${day.id}`} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body p-4 flex-row items-center justify-between">
        <div>
          <div className="card-title text-base gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(day.date)}
          </div>
          <div className="text-sm text-base-content/60 mt-1">
            <span className={getNutrientColor(totals.calories, DAY_TARGETS.calories)}>
              {round(totals.calories)} {TEXTS.nutrients.cal.toLowerCase()}
            </span>
            {' · '}
            <span className={getNutrientColor(totals.carbs, DAY_TARGETS.carbs)}>
              {round(totals.carbs)}g {TEXTS.nutrients.ch.toLowerCase()}
            </span>
            {' · '}
            {round(totals.fat)}g {TEXTS.nutrients.fat.toLowerCase()}
            {dishCount > 0 && (
              <span>
                {' '}
                · {day.meals.length} {TEXTS.dashboard.mealsCount.toLowerCase()} · {dishCount} {TEXTS.dashboard.dishesCount.toLowerCase()}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          disabled={deleting}
          className="btn btn-ghost btn-sm text-error"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
}

function getNutrientColor(actual: number, target: number | undefined): string {
  if (!target) return '';
  const deviation = Math.abs(actual - target) / target;
  if (deviation > 0.2) return 'text-error';
  if (deviation > 0.1) return 'text-warning';
  return '';
}
