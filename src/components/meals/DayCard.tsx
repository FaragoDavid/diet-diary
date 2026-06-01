import { Link } from 'react-router-dom';
import { Trash2, Calendar, ShoppingCart, Copy } from 'lucide-react';
import { round, getNutrientColor, formatDate } from '../../utils/format';
import { DAY_TARGETS } from '../../constants/meal-targets';
import { TEXTS } from '../../constants/texts';
import type { Day } from '../../types/day';

export default function DayCard({
  day,
  onDelete,
  onShopping,
  onCopy,
  deleting,
}: {
  day: Day;
  onDelete: () => void;
  onShopping: () => void;
  onCopy: () => void;
  deleting: boolean;
}) {
  const totals = day.meals.reduce(
    (acc, meal) => {
      meal.dishes.forEach((dish) => {
        acc.calories += dish.calories;
        acc.carbs += dish.carbs;
        acc.fat += dish.fat;
      });
      return acc;
    },
    { calories: 0, carbs: 0, fat: 0 },
  );
  return (
    <Link
      to={`/meals/${day.id}`}
      data-testid={`day-card-${day.id}`}
      className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="card-body p-4 flex-row items-center justify-between">
        <div>
          <div className="card-title text-base gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(day.date)}
          </div>
          <div className="text-sm text-base-content/60 mt-1">
            <span className={getNutrientColor(totals.calories, DAY_TARGETS.calories)}>
              {round(totals.calories)} {TEXTS.nutrients.kcalUnit}
            </span>
            {' · '}
            <span className={getNutrientColor(totals.carbs, DAY_TARGETS.carbs)}>
              {round(totals.carbs)}g {TEXTS.nutrients.chUnit}
            </span>
            {' · '}
            {round(totals.fat)}g {TEXTS.nutrients.fatUnit}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(event) => {
              event.preventDefault();
              onShopping();
            }}
            data-testid="shopping-button"
            className="btn btn-ghost btn-sm"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              onCopy();
            }}
            data-testid="copy-button"
            className="btn btn-ghost btn-sm"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              onDelete();
            }}
            disabled={deleting}
            data-testid="delete-button"
            className="btn btn-ghost btn-sm text-error"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
