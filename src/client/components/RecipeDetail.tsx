import { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Save } from 'lucide-react';
import { useRecipes, updateRecipe } from '../services/recipes';
import { useIngredients } from '../services/ingredients';
import IngredientAutocomplete from './IngredientAutocomplete';
import { calculateRecipeNutrition, calculateIngredientNutrition, round } from '../utils/nutrition';
import type { Ingredient } from '../types/ingredient';
import type { RecipeIngredient } from '../types/recipe';

export default function RecipeDetail({ uid }: { uid: string }) {
  const { recipeId } = useParams<{ recipeId: string }>();
  const { recipes, loading: recipesLoading } = useRecipes(uid);
  const { ingredients, loading: ingredientsLoading } = useIngredients(uid);

  const recipe = recipes.find((r) => r.id === recipeId);
  const ingredientsMap = useMemo(() => new Map(ingredients.map((i) => [i.id, i])), [ingredients]);

  const saveIngredients = useCallback(
    async (updated: RecipeIngredient[]) => {
      if (!recipeId) return;
      const nutrition = calculateRecipeNutrition(updated, ingredientsMap);
      await updateRecipe(uid, recipeId, {
        ingredients: updated,
        calories: round(nutrition.calories),
        carbs: round(nutrition.carbs),
        fat: round(nutrition.fat),
      });
    },
    [uid, recipeId, ingredientsMap],
  );

  if (recipesLoading || ingredientsLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/50 mb-4">Recipe not found</p>
        <Link to="/recipes" className="btn btn-ghost btn-sm">
          <ArrowLeft className="w-4 h-4" /> Back to recipes
        </Link>
      </div>
    );
  }

  const nutrition = calculateRecipeNutrition(recipe.ingredients, ingredientsMap);
  const availableIngredients = ingredients.filter((i) => !recipe.ingredients.some((ri) => ri.ingredientId === i.id));

  return (
    <div className="space-y-6">
      <Link to="/recipes" className="btn btn-ghost btn-sm">
        <ArrowLeft className="w-4 h-4" /> Recipes
      </Link>

      <RecipeHeader uid={uid} recipeId={recipe.id} name={recipe.name} amount={recipe.amount} servings={recipe.servings} />

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Calories</div>
          <div className="stat-value text-lg">{round(nutrition.calories)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Carbs</div>
          <div className="stat-value text-lg">{round(nutrition.carbs)}g</div>
        </div>
        <div className="stat">
          <div className="stat-title">Fat</div>
          <div className="stat-value text-lg">{round(nutrition.fat)}g</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Ingredients</h3>
        <AddIngredientRow recipeIngredients={recipe.ingredients} available={availableIngredients} onSave={saveIngredients} />
        {recipe.ingredients.length === 0 ? (
          <p className="text-base-content/50 py-4 text-center">No ingredients yet. Add one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th className="text-right">Amount (g)</th>
                  <th className="text-right">Cal</th>
                  <th className="text-right">Carbs</th>
                  <th className="text-right">Fat</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients.map((ri) => (
                  <RecipeIngredientRow
                    key={ri.ingredientId}
                    ri={ri}
                    ingredient={ingredientsMap.get(ri.ingredientId)}
                    allIngredients={recipe.ingredients}
                    onSave={saveIngredients}
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

function RecipeHeader({
  uid,
  recipeId,
  name,
  amount,
  servings,
}: {
  uid: string;
  recipeId: string;
  name: string;
  amount: number | null;
  servings: number;
}) {
  const [editName, setEditName] = useState(name);
  const [editAmount, setEditAmount] = useState(amount?.toString() ?? '');
  const [editServings, setEditServings] = useState(servings.toString());
  const [saving, setSaving] = useState(false);

  const hasChanges = editName !== name || editAmount !== (amount?.toString() ?? '') || editServings !== servings.toString();

  const handleSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await updateRecipe(uid, recipeId, {
        name: editName.trim(),
        amount: editAmount ? parseFloat(editAmount) : null,
        servings: parseInt(editServings) || 1,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="form-control flex-1 min-w-48">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="input input-bordered" />
      </div>
      <div className="form-control w-28">
        <label className="label">
          <span className="label-text">Amount (g)</span>
        </label>
        <input
          type="number"
          min="0"
          step="1"
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
          placeholder="—"
          className="input input-bordered"
        />
      </div>
      <div className="form-control w-24">
        <label className="label">
          <span className="label-text">Servings</span>
        </label>
        <input
          type="number"
          min="1"
          step="1"
          value={editServings}
          onChange={(e) => setEditServings(e.target.value)}
          className="input input-bordered"
        />
      </div>
      {hasChanges && (
        <button onClick={handleSave} disabled={saving || !editName.trim()} className="btn btn-primary btn-sm">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
        </button>
      )}
    </div>
  );
}

function AddIngredientRow({
  recipeIngredients,
  available,
  onSave,
}: {
  recipeIngredients: RecipeIngredient[];
  available: Ingredient[];
  onSave: (ingredients: RecipeIngredient[]) => Promise<void>;
}) {
  const [amount, setAmount] = useState('100');
  const [saving, setSaving] = useState(false);

  const handleSelect = async (ingredient: Ingredient) => {
    const amountNum = parseFloat(amount) || 100;
    setSaving(true);
    try {
      await onSave([...recipeIngredients, { ingredientId: ingredient.id, name: ingredient.name, amount: amountNum }]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <IngredientAutocomplete ingredients={available} onSelect={handleSelect} placeholder="Add ingredient..." />
      </div>
      <div className="w-24">
        <input
          type="number"
          min="0"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input input-bordered w-full"
          placeholder="g"
        />
      </div>
      {saving && <span className="loading loading-spinner loading-sm"></span>}
    </div>
  );
}

function RecipeIngredientRow({
  ri,
  ingredient,
  allIngredients,
  onSave,
}: {
  ri: RecipeIngredient;
  ingredient: Ingredient | undefined;
  allIngredients: RecipeIngredient[];
  onSave: (ingredients: RecipeIngredient[]) => Promise<void>;
}) {
  const [editAmount, setEditAmount] = useState(ri.amount.toString());
  const [saving, setSaving] = useState(false);

  const nutrition = ingredient ? calculateIngredientNutrition(ingredient, ri.amount) : { calories: 0, carbs: 0, fat: 0 };
  const amountChanged = parseFloat(editAmount) !== ri.amount;

  const handleUpdateAmount = async () => {
    const newAmount = parseFloat(editAmount);
    if (!newAmount || newAmount <= 0) return;
    setSaving(true);
    try {
      await onSave(allIngredients.map((i) => (i.ingredientId === ri.ingredientId ? { ...i, amount: newAmount } : i)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await onSave(allIngredients.filter((i) => i.ingredientId !== ri.ingredientId));
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr>
      <td className="font-medium">{ri.name}</td>
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
      <td className="text-right tabular-nums">{round(nutrition.calories)}</td>
      <td className="text-right tabular-nums">{round(nutrition.carbs)}</td>
      <td className="text-right tabular-nums">{round(nutrition.fat)}</td>
      <td>
        <button onClick={handleDelete} disabled={saving} className="btn btn-ghost btn-xs text-error">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}
