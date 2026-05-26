import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDays, updateDay } from '../../services/days';
import { round, getNutrientColor, formatDate, formatDateShort } from '../../utils/format';
import { MEAL_TYPES } from '../../types/day';
import { TEXTS } from '../../constants/texts';
import { DAY_TARGETS } from '../../constants/meal-targets';
import DayMeal from './DayMeal';
import VariantDialog from '../VariantDialog';
import PageHeader from '../PageHeader';
import AddMealButton from './AddMealButton';
import type { Meal } from '../../types/day';

export default function DayDetail() {
  const { dayId } = useParams<{ dayId: string }>();
  const { days } = useDays();

  const day = days.find((d) => d.id === dayId);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);

  if (!day) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/50 mb-4">{TEXTS.meals.dayNotFound}</p>
        <Link to="/meals" className="btn btn-ghost btn-sm">
          <ArrowLeft className="w-4 h-4" /> {TEXTS.meals.backToMeals}
        </Link>
      </div>
    );
  }

  const dayTotals = day.meals.reduce(
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

  const existingMealTypes = new Set(day.meals.map((m) => m.type));
  const availableMealTypes = MEAL_TYPES.filter((t) => !existingMealTypes.has(t));

  const saveMeals = async (meals: Meal[]) => {
    await updateDay(day.id, meals);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <PageHeader>
        <div className="flex items-center gap-2">
          <Link to="/meals" className="btn btn-ghost btn-sm btn-square">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h2 className="text-xl font-bold">
            <span className="sm:hidden">{formatDateShort(day.date)}</span>
            <span className="hidden sm:inline">{formatDate(day.date)}</span>
          </h2>
          <span className="text text-base-content/60">
            <span className={getNutrientColor(dayTotals.calories, DAY_TARGETS.calories)}>
              {round(dayTotals.calories)} {TEXTS.nutrients.kcalUnit}
            </span>
            {' · '}
            <span className={getNutrientColor(dayTotals.carbs, DAY_TARGETS.carbs)}>
              {round(dayTotals.carbs)}g {TEXTS.nutrients.chUnit}
            </span>
            {' · '}
            {round(dayTotals.fat)}g {TEXTS.nutrients.fatUnit}
          </span>
        </div>
        <AddMealButton availableTypes={availableMealTypes} meals={day.meals} onSave={saveMeals} />
      </PageHeader>

      {day.meals.length === 0 ? (
        <p className="text-center py-8 text-base-content/50">{TEXTS.meals.noMeals}</p>
      ) : (
        <div className="flex-1 overflow-auto grid gap-2 content-start">
          {day.meals.map((meal) => (
            <DayMeal key={meal.type} meal={meal} allMeals={day.meals} onSave={saveMeals} onEditVariant={setEditingVariantId} />
          ))}
        </div>
      )}

      <VariantDialog variantId={editingVariantId} onClose={() => setEditingVariantId(null)} />
    </div>
  );
}
