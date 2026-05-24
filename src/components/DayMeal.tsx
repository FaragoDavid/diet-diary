import { useState, useRef, useEffect } from 'react';
import { Trash2, GitBranch } from 'lucide-react';
import { createVariant } from '../services/recipes';
import { calculateIngredientNutrition, calculateRecipeNutrition, round, getNutrientColor } from '../utils/nutrition';
import { MEAL_TYPE_LABELS } from '../types/day';
import { TEXTS } from '../constants/texts';
import { MEAL_TARGETS } from '../constants/meal-targets';
import DishSelector from './DishSelector';
import type { DishSelection } from './DishSelector';
import type { Meal, Dish } from '../types/day';
import type { Ingredient } from '../types/ingredient';
import type { Recipe } from '../types/recipe';

export default function DayMeal({
  meal,
  allMeals,
  ingredients,
  ingredientsMap,
  recipes,
  recipesMap,
  onSave,
  onEditVariant,
}: {
  meal: Meal;
  allMeals: Meal[];
  ingredients: Ingredient[];
  ingredientsMap: Map<string, Ingredient>;
  recipes: Recipe[];
  recipesMap: Map<string, Recipe>;
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
            <DishSelector ingredients={ingredients} recipes={recipes} onSelect={handleAddDish} />
          </div>
          {addingSaving && <span className="loading loading-spinner loading-sm"></span>}
        </div>

        {meal.dishes.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>{TEXTS.meals.dish}</th>
                  <th className="text-right">{TEXTS.meals.amount}</th>
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
                    ingredientsMap={ingredientsMap}
                    recipesMap={recipesMap}
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

function DishRow({
  dish,
  allDishes,
  ingredientsMap,
  recipesMap,
  onSave,
  onEditVariant,
  autoFocus,
}: {
  dish: Dish;
  allDishes: Dish[];
  ingredientsMap: Map<string, Ingredient>;
  recipesMap: Map<string, Recipe>;
  onSave: (dishes: Dish[]) => Promise<void>;
  onEditVariant: (variantId: string) => void;
  autoFocus?: boolean;
}) {
  const [editAmount, setEditAmount] = useState(dish.amount ? dish.amount.toString() : '');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 0);
  }, [autoFocus]);

  const computeNutrition = (amount: number): { calories: number; carbs: number; fat: number } => {
    if (dish.ingredientId) {
      const ingredient = ingredientsMap.get(dish.ingredientId);
      if (ingredient) return calculateIngredientNutrition(ingredient, amount);
    } else if (dish.recipeId) {
      const recipe = recipesMap.get(dish.recipeId);
      if (recipe) {
        const n = calculateRecipeNutrition(recipe.ingredients, ingredientsMap);
        const factor = recipe.amount ? amount / recipe.amount : amount / 100;
        return { calories: n.calories * factor, carbs: n.carbs * factor, fat: n.fat * factor };
      }
    }
    if (dish.amount) {
      const factor = amount / dish.amount;
      return { calories: dish.calories * factor, carbs: dish.carbs * factor, fat: dish.fat * factor };
    }
    return { calories: 0, carbs: 0, fat: 0 };
  };

  const handleBlur = async () => {
    const newAmount = parseFloat(editAmount);
    if (!newAmount || newAmount <= 0 || newAmount === dish.amount) return;
    const n = computeNutrition(newAmount);
    setSaving(true);
    try {
      await onSave(
        allDishes.map((d) =>
          d.id === dish.id ? { ...d, amount: newAmount, calories: round(n.calories), carbs: round(n.carbs), fat: round(n.fat) } : d,
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await onSave(allDishes.filter((d) => d.id !== dish.id));
    } finally {
      setSaving(false);
    }
  };

  const handleCustomize = async () => {
    if (!dish.recipeId) return;
    const recipe = recipesMap.get(dish.recipeId);
    if (!recipe) return;
    setSaving(true);
    try {
      const variantId = await createVariant(recipe);
      await onSave(allDishes.map((d) => (d.id === dish.id ? { ...d, recipeId: variantId } : d)));
      onEditVariant(variantId);
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr>
      <td className="font-medium">{dish.name}</td>
      <td className="text-right">
        <input
          ref={inputRef}
          type="number"
          min="0"
          step="1"
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
          onBlur={handleBlur}
          className="input input-bordered input-sm text-right"
        />
      </td>
      <td className="text-right tabular-nums">{round(dish.calories)}</td>
      <td className="text-right tabular-nums">{round(dish.carbs)}</td>
      <td className="text-right tabular-nums">{round(dish.fat)}</td>
      <td>
        <div className="flex gap-0.5">
          {dish.recipeId && (
            <button onClick={handleCustomize} disabled={saving} className="btn btn-ghost btn-xs" title={TEXTS.meals.customize}>
              <GitBranch className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={handleDelete} disabled={saving} className="btn btn-ghost btn-xs text-error">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
