import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { round, getNutrientColor } from '../../utils/nutrition';
import { MEAL_TYPE_LABELS } from '../../types/day';
import { TEXTS } from '../../constants/texts';
import { MEAL_TARGETS } from '../../constants/meal-targets';
import DishSelector from '../DishSelector';
import DishRow from './DishRow';
import type { DishSelection } from '../DishSelector';
import type { Meal, Dish } from '../../types/day';

export default function DayMeal({
  meal,
  allMeals,
  onSave,
  onEditVariant,
}: {
  meal: Meal;
  allMeals: Meal[];
  onSave: (meals: Meal[]) => Promise<void>;
  onEditVariant: (variantId: string) => void;
}) {
  const [focusDishId, setFocusDishId] = useState<string | null>(null);
  const [addingSaving, setAddingSaving] = useState(false);
  const targets = MEAL_TARGETS[meal.type];
  const mealTotals = meal.dishes.reduce(
    (acc, d) => ({ calories: acc.calories + d.calories, carbs: acc.carbs + d.carbs, fat: acc.fat + d.fat }),
    { calories: 0, carbs: 0, fat: 0 },
  );

  const removeMeal = async () => {
    await onSave(allMeals.filter((m) => m.type !== meal.type));
  };

  const updateDishes = async (dishes: Dish[]) => {
    await onSave(allMeals.map((m) => (m.type === meal.type ? { ...m, dishes } : m)));
  };

  const handleAddDish = async (selection: DishSelection) => {
    setAddingSaving(true);
    try {
      const id = crypto.randomUUID();
      const dish: Dish = {
        id,
        name: selection.name,
        amount: 0,
        calories: 0,
        carbs: 0,
        fat: 0,
        recipeId: selection.type === 'recipe' ? selection.id : null,
        ingredientId: selection.type === 'ingredient' ? selection.id : null,
      };
      setFocusDishId(id);
      await updateDishes([...meal.dishes, dish]);
    } finally {
      setAddingSaving(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="card-title text-base">
            {MEAL_TYPE_LABELS[meal.type]}
            {targets && (
              <span className="text-xs font-normal text-base-content/40">
                ({targets.calories} kCal, {targets.carbs} CH)
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/60">
              <span className={getNutrientColor(mealTotals.calories, targets?.calories)}>
                {round(mealTotals.calories)} {TEXTS.nutrients.kcalUnit}
              </span>
              {' · '}
              <span className={getNutrientColor(mealTotals.carbs, targets?.carbs)}>
                {round(mealTotals.carbs)}g {TEXTS.nutrients.chUnit}
              </span>
              {' · '}
              {round(mealTotals.fat)}g {TEXTS.nutrients.fatUnit}
            </span>
            <button onClick={removeMeal} className="btn btn-ghost btn-xs text-error">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <DishSelector onSelect={handleAddDish} />
          </div>
          {addingSaving && <span className="loading loading-spinner loading-sm"></span>}
        </div>

        {meal.dishes.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>{TEXTS.meals.dish}</th>
                  <th className="text-right">{TEXTS.meals.g}</th>
                  <th className="text-right">{TEXTS.nutrients.cal}</th>
                  <th className="text-right">{TEXTS.nutrients.ch}</th>
                  <th className="text-right">{TEXTS.nutrients.fat}</th>
                  <th className="w-0"></th>
                </tr>
              </thead>
              <tbody>
                {meal.dishes.map((dish) => (
                  <DishRow
                    key={dish.id}
                    dish={dish}
                    allDishes={meal.dishes}
                    onSave={updateDishes}
                    onEditVariant={onEditVariant}
                    autoFocus={focusDishId === dish.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
