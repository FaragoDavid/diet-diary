import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { useDays, updateDay } from '../services/days';
import { useIngredients } from '../services/ingredients';
import { useRecipes } from '../services/recipes';
import { calculateIngredientNutrition, calculateRecipeNutrition, round } from '../utils/nutrition';
import { MEAL_TYPES, MEAL_TYPE_LABELS } from '../types/day';
import { TEXTS } from '../constants/texts';
import type { Meal, Dish, MealType } from '../types/day';
import type { Ingredient } from '../types/ingredient';
import type { Recipe } from '../types/recipe';

export default function DayDetail({ uid }: { uid: string }) {
  const { dayId } = useParams<{ dayId: string }>();
  const { days, loading: daysLoading } = useDays(uid);
  const { ingredients, loading: ingredientsLoading } = useIngredients(uid);
  const { recipes, loading: recipesLoading } = useRecipes(uid);

  const day = days.find((d) => d.id === dayId);
  const ingredientsMap = useMemo(() => new Map(ingredients.map((i) => [i.id, i])), [ingredients]);
  const recipesMap = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);

  if (daysLoading || ingredientsLoading || recipesLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

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
    await updateDay(uid, day.id, meals);
  };

  return (
    <div className="space-y-6">
      <Link to="/meals" className="btn btn-ghost btn-sm">
        <ArrowLeft className="w-4 h-4" /> {TEXTS.nav.meals}
      </Link>

      <h2 className="text-2xl font-bold">{formatDate(day.date)}</h2>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">{TEXTS.nutrients.calories}</div>
          <div className="stat-value text-lg">{round(dayTotals.calories)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">{TEXTS.nutrients.ch}</div>
          <div className="stat-value text-lg">{round(dayTotals.carbs)}g</div>
        </div>
        <div className="stat">
          <div className="stat-title">{TEXTS.nutrients.fat}</div>
          <div className="stat-value text-lg">{round(dayTotals.fat)}g</div>
        </div>
      </div>

      <AddMealButton availableTypes={availableMealTypes} meals={day.meals} onSave={saveMeals} />

      {day.meals.length === 0 ? (
        <p className="text-center py-8 text-base-content/50">{TEXTS.meals.noMeals}</p>
      ) : (
        <div className="space-y-4">
          {day.meals.map((meal) => (
            <MealSection
              key={meal.type}
              meal={meal}
              allMeals={day.meals}
              ingredients={ingredients}
              ingredientsMap={ingredientsMap}
              recipes={recipes}
              recipesMap={recipesMap}
              onSave={saveMeals}
            />
          ))}
        </div>
      )}
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
        <Plus className="w-4 h-4" /> {TEXTS.meals.addMeal}
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

function MealSection({
  meal,
  allMeals,
  ingredients,
  ingredientsMap,
  recipes,
  recipesMap,
  onSave,
}: {
  meal: Meal;
  allMeals: Meal[];
  ingredients: Ingredient[];
  ingredientsMap: Map<string, Ingredient>;
  recipes: Recipe[];
  recipesMap: Map<string, Recipe>;
  onSave: (meals: Meal[]) => Promise<void>;
}) {
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

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="card-title text-base">{MEAL_TYPE_LABELS[meal.type]}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/60">
              {round(mealTotals.calories)} {TEXTS.nutrients.cal.toLowerCase()} · {round(mealTotals.carbs)}c · {round(mealTotals.fat)}f
            </span>
            <button onClick={removeMeal} className="btn btn-ghost btn-xs text-error">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <AddDishRow
          dishes={meal.dishes}
          ingredients={ingredients}
          ingredientsMap={ingredientsMap}
          recipes={recipes}
          recipesMap={recipesMap}
          onSave={updateDishes}
        />

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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {meal.dishes.map((dish) => (
                  <DishRow key={dish.id} dish={dish} allDishes={meal.dishes} onSave={updateDishes} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AddDishRow({
  dishes,
  ingredients,
  ingredientsMap,
  recipes,
  recipesMap,
  onSave,
}: {
  dishes: Dish[];
  ingredients: Ingredient[];
  ingredientsMap: Map<string, Ingredient>;
  recipes: Recipe[];
  recipesMap: Map<string, Recipe>;
  onSave: (dishes: Dish[]) => Promise<void>;
}) {
  const [selectedId, setSelectedId] = useState('');
  const [amount, setAmount] = useState('100');
  const [saving, setSaving] = useState(false);

  const options = [
    ...ingredients.map((i) => ({ id: `ing:${i.id}`, label: i.name, group: TEXTS.nav.ingredients })),
    ...recipes.map((r) => ({ id: `rec:${r.id}`, label: r.name, group: TEXTS.nav.recipes })),
  ];

  const handleAdd = async () => {
    if (!selectedId) return;
    const amountNum = parseFloat(amount) || 100;
    setSaving(true);
    try {
      let dish: Dish | null = null;
      if (selectedId.startsWith('ing:')) {
        const ingId = selectedId.slice(4);
        const ingredient = ingredientsMap.get(ingId);
        if (!ingredient) return;
        const n = calculateIngredientNutrition(ingredient, amountNum);
        dish = {
          id: crypto.randomUUID(),
          name: ingredient.name,
          amount: amountNum,
          calories: round(n.calories),
          carbs: round(n.carbs),
          fat: round(n.fat),
          recipeId: null,
          ingredientId: ingId,
        };
      } else if (selectedId.startsWith('rec:')) {
        const recId = selectedId.slice(4);
        const recipe = recipesMap.get(recId);
        if (!recipe) return;
        const n = calculateRecipeNutrition(recipe.ingredients, ingredientsMap);
        const factor = recipe.amount ? amountNum / recipe.amount : amountNum / 100;
        dish = {
          id: crypto.randomUUID(),
          name: recipe.name,
          amount: amountNum,
          calories: round(n.calories * factor),
          carbs: round(n.carbs * factor),
          fat: round(n.fat * factor),
          recipeId: recId,
          ingredientId: null,
        };
      }
      if (dish) {
        await onSave([...dishes, dish]);
        setSelectedId('');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="select select-bordered flex-1 select-sm">
        <option value="">{TEXTS.meals.addDish}</option>
        {options.some((o) => o.group === TEXTS.nav.ingredients) && (
          <optgroup label={TEXTS.nav.ingredients}>
            {options
              .filter((o) => o.group === TEXTS.nav.ingredients)
              .map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
          </optgroup>
        )}
        {options.some((o) => o.group === TEXTS.nav.recipes) && (
          <optgroup label={TEXTS.nav.recipes}>
            {options
              .filter((o) => o.group === TEXTS.nav.recipes)
              .map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
          </optgroup>
        )}
      </select>
      <input
        type="number"
        min="0"
        step="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input input-bordered input-sm w-20"
        placeholder={TEXTS.meals.g}
      />
      <button onClick={handleAdd} disabled={saving || !selectedId} className="btn btn-primary btn-sm">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

function DishRow({ dish, allDishes, onSave }: { dish: Dish; allDishes: Dish[]; onSave: (dishes: Dish[]) => Promise<void> }) {
  const [editAmount, setEditAmount] = useState(dish.amount.toString());
  const [saving, setSaving] = useState(false);

  const amountChanged = parseFloat(editAmount) !== dish.amount;

  const handleUpdateAmount = async () => {
    const newAmount = parseFloat(editAmount);
    if (!newAmount || newAmount <= 0) return;
    const factor = newAmount / dish.amount;
    setSaving(true);
    try {
      await onSave(
        allDishes.map((d) =>
          d.id === dish.id
            ? { ...d, amount: newAmount, calories: round(d.calories * factor), carbs: round(d.carbs * factor), fat: round(d.fat * factor) }
            : d,
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

  return (
    <tr>
      <td className="font-medium">{dish.name}</td>
      <td className="text-right">
        <div className="flex items-center justify-end gap-1">
          <input
            type="number"
            min="0"
            step="1"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            className="input input-bordered input-xs w-20 text-right"
          />
          {amountChanged && (
            <button onClick={handleUpdateAmount} disabled={saving} className="btn btn-ghost btn-xs">
              <Save className="w-3 h-3" />
            </button>
          )}
        </div>
      </td>
      <td className="text-right tabular-nums">{round(dish.calories)}</td>
      <td className="text-right tabular-nums">{round(dish.carbs)}</td>
      <td className="text-right tabular-nums">{round(dish.fat)}</td>
      <td>
        <button onClick={handleDelete} disabled={saving} className="btn btn-ghost btn-xs text-error">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
}
