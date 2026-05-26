import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, Check } from 'lucide-react';
import { useDays, createDay, updateDay, deleteDay } from '../../services/days';
import { useIngredients } from '../../services/ingredients';
import { useRecipes } from '../../services/recipes';
import { buildIngredientMap } from '../../utils/nutrition';
import { round } from '../../utils/format';
import { TEXTS } from '../../constants/texts';
import ShoppingList, { aggregateIngredients } from './ShoppingList';
import CopyDayDialog from './CopyDayDialog';
import PageHeader from '../PageHeader';
import DayCard from './DayCard';
import type { Day } from '../../types/day';

export default function MealsPage() {
  const { days } = useDays();
  const { ingredients } = useIngredients();
  const { recipes } = useRecipes();
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [shoppingStartDate, setShoppingStartDate] = useState<string | null>(null);
  const [shoppingDaysCount, setShoppingDaysCount] = useState(1);
  const [copyingDay, setCopyingDay] = useState<Day | null>(null);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  const ingredientsMap = useMemo(() => buildIngredientMap(ingredients, recipes), [ingredients, recipes]);
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
      await createDay(dateStr);
      navigate(`/meals/${dateStr}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (dayId: string) => {
    setDeletingId(dayId);
    await deleteDay(dayId);
    setDeletingId(null);
  };

  const handleOpenShopping = (date: string) => {
    setShoppingDaysCount(1);
    setShoppingStartDate(date);
  };

  const handleCloseShopping = () => {
    setShoppingStartDate(null);
  };

  const existingDates = useMemo(() => new Set(days.map((day) => day.date)), [days]);

  const handleConfirmCopy = async (targetDate: string) => {
    if (!copyingDay) return;
    const meals = copyingDay.meals;
    setCopyingDay(null);
    await createDay(targetDate);
    await updateDay(targetDate, meals);
    navigate(`/meals/${targetDate}`);
  };

  const handleCopy = async () => {
    const items = aggregateIngredients(shoppingDay, ingredientsMap, recipesMap);
    const text = items.map((item) => `- [ ] ${item.name}: ${round(item.totalAmount * shoppingDaysCount)}g`).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <PageHeader title={TEXTS.nav.meals}>
        <button onClick={handleCreate} disabled={creating} className="btn btn-primary btn-sm">
          <Plus className="w-4 h-4" />
        </button>
      </PageHeader>

      {days.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">{TEXTS.meals.noDays}</div>
      ) : (
        <div className="flex-1 overflow-auto grid gap-2 content-start">
          {days.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              onDelete={() => handleDelete(day.id)}
              onShopping={() => handleOpenShopping(day.date)}
              onCopy={() => setCopyingDay(day)}
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
          <ShoppingList days={shoppingDay} multiplier={shoppingDaysCount} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <CopyDayDialog
        sourceDay={copyingDay}
        existingDates={existingDates}
        onConfirm={handleConfirmCopy}
        onClose={() => setCopyingDay(null)}
      />
    </div>
  );
}
