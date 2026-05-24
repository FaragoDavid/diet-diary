import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { useDays, updateDay } from '../services/days';
import { useIngredients } from '../services/ingredients';
import { useRecipes } from '../services/recipes';
import { round, getNutrientColor, buildNutritionMap } from '../utils/nutrition';
import { formatDate, formatDateShort } from '../utils/format';
import { MEAL_TYPES, MEAL_TYPE_LABELS } from '../types/day';
import { TEXTS } from '../constants/texts';
import { DAY_TARGETS } from '../constants/meal-targets';
import DayMeal from './DayMeal';
import VariantDialog from './VariantDialog';
import PageHeader from './PageHeader';
import type { Meal, MealType } from '../types/day';

export default function DayDetail() {
  const { dayId } = useParams<{ dayId: string }>();
  const { days } = useDays();
  const { ingredients } = useIngredients();
  const { recipes } = useRecipes();

  const day = days.find((d) => d.id === dayId);
  const ingredientsMap = useMemo(() => buildNutritionMap(ingredients, recipes), [ingredients, recipes]);
  const recipesMap = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);
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
    <div className="space-y-4">
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
              {round(dayTotals.calories)} {TEXTS.nutrients.cal.toLowerCase()}
            </span>
            {' · '}
            <span className={getNutrientColor(dayTotals.carbs, DAY_TARGETS.carbs)}>
              {round(dayTotals.carbs)}g {TEXTS.nutrients.ch.toLowerCase()}
            </span>
            {' · '}
            {round(dayTotals.fat)}g {TEXTS.nutrients.fat.toLowerCase()}
          </span>
        </div>
        <AddMealButton availableTypes={availableMealTypes} meals={day.meals} onSave={saveMeals} />
      </PageHeader>

      {day.meals.length === 0 ? (
        <p className="text-center py-8 text-base-content/50">{TEXTS.meals.noMeals}</p>
      ) : (
        <div className="grid gap-2">
          {day.meals.map((meal) => (
            <DayMeal
              key={meal.type}
              meal={meal}
              allMeals={day.meals}
              ingredients={ingredients}
              ingredientsMap={ingredientsMap}
              recipes={recipes}
              recipesMap={recipesMap}
              onSave={saveMeals}
              onEditVariant={setEditingVariantId}
            />
          ))}
        </div>
      )}

      <VariantDialog variantId={editingVariantId} recipes={recipes} ingredients={ingredients} onClose={() => setEditingVariantId(null)} />
    </div>
  );
}

function AddMealButton({
  availableTypes,
  meals,
  onSave,
}: {
  availableTypes: MealType[];
  meals: Meal[];
  onSave: (meals: Meal[]) => Promise<void>;
}) {
  const [adding, setAdding] = useState(false);

  if (availableTypes.length === 0) return null;

  const handleAdd = async (type: MealType) => {
    setAdding(true);
    try {
      const sorted = [...meals, { type, dishes: [] }].sort((a, b) => MEAL_TYPES.indexOf(a.type) - MEAL_TYPES.indexOf(b.type));
      await onSave(sorted);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-primary btn-sm">
        <Plus className="w-4 h-4" /> <span className="hidden sm:inline">{TEXTS.meals.addMeal}</span>
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow">
        {availableTypes.map((type) => (
          <li key={type}>
            <button onClick={() => handleAdd(type)} disabled={adding}>
              {MEAL_TYPE_LABELS[type]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
