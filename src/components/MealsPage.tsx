import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Calendar, ShoppingCart, Copy, Check } from 'lucide-react';
import { useDays, createDay, deleteDay } from '../services/days';
import { useIngredients } from '../services/ingredients';
import { useRecipes } from '../services/recipes';
import { round, getNutrientColor } from '../utils/nutrition';
import { formatDate } from '../utils/format';
import { DAY_TARGETS } from '../constants/meal-targets';
import { TEXTS } from '../constants/texts';
import ShoppingList, { aggregateIngredients } from './ShoppingList';
import type { Day } from '../types/day';

export default function MealsPage({ uid }: { uid: string }) {
  const { days, loading, error } = useDays(uid);
  const { ingredients } = useIngredients(uid);
  const { recipes } = useRecipes(uid);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [shoppingStartDate, setShoppingStartDate] = useState<string | null>(null);
  const [shoppingDaysCount, setShoppingDaysCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  const ingredientsMap = useMemo(() => new Map(ingredients.map((i) => [i.id, i])), [ingredients]);
  const recipesMap = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);

  const shoppingDay = useMemo(() => {
    if (!shoppingStartDate) return [];
    const day = days.find((d) => d.date === shoppingStartDate);
    return day ? [day] : [];
  }, [days, shoppingStartDate]);

  useEffect(() => {
    if (shoppingStartDate) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [shoppingStartDate]);

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

  const handleOpenShopping = (date: string) => {
    setShoppingDaysCount(1);
    setShoppingStartDate(date);
  };

  const handleCloseShopping = () => {
    setShoppingStartDate(null);
  };

  const handleCopy = async () => {
    const items = aggregateIngredients(shoppingDay, ingredientsMap, recipesMap);
    const text = items.map((item) => `${item.name}: ${round(item.totalAmount * shoppingDaysCount)}g`).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <div className="grid gap-2">
          {days.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              onDelete={() => handleDelete(day.id)}
              onShopping={() => handleOpenShopping(day.date)}
              deleting={deletingId === day.id}
            />
          ))}
        </div>
      )}

      <dialog ref={dialogRef} className="modal" onClose={handleCloseShopping}>
        <div className="modal-box">
          <div className="flex items-center gap-1 mb-4">
            <span className="text-sm font-medium mr-1">{TEXTS.shoppingList.daysCount}:</span>
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button
                key={n}
                onClick={() => setShoppingDaysCount(n)}
                className={`btn btn-sm ${shoppingDaysCount === n ? 'btn-primary' : 'btn-ghost'}`}
              >
                {n}
              </button>
            ))}
            <button onClick={handleCopy} className="btn btn-sm btn-outline ml-auto">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <ShoppingList days={shoppingDay} ingredientsMap={ingredientsMap} recipesMap={recipesMap} multiplier={shoppingDaysCount} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

function DayCard({ day, onDelete, onShopping, deleting }: { day: Day; onDelete: () => void; onShopping: () => void; deleting: boolean }) {
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
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              onShopping();
            }}
            className="btn btn-ghost btn-sm"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
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
      </div>
    </Link>
  );
}
