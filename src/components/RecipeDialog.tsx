import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { updateRecipe } from '../services/recipes';
import IngredientSelector from './IngredientSelector';
import { calculateRecipeNutrition, calculateIngredientNutrition, round, formatNutrition } from '../utils/nutrition';
import { TEXTS } from '../constants/texts';
import type { Recipe, RecipeIngredient } from '../types/recipe';
import type { Ingredient } from '../types/ingredient';

export default function RecipeDialog({
  uid,
  recipe,
  ingredients,
  onClose,
  initialEditHeader = false,
  baseRecipeName,
}: {
  uid: string;
  recipe: Recipe;
  ingredients: Ingredient[];
  onClose: () => void;
  initialEditHeader?: boolean;
  baseRecipeName?: string;
}) {
  const ingredientsMap = useMemo(() => new Map(ingredients.map((i) => [i.id, i])), [ingredients]);
  const [editingHeader, setEditingHeader] = useState(initialEditHeader);
  const [focusIngredientId, setFocusIngredientId] = useState<string | null>(null);

  const saveIngredients = useCallback(
    async (updated: RecipeIngredient[]) => {
      const nutrition = calculateRecipeNutrition(updated, ingredientsMap);
      await updateRecipe(uid, recipe.id, {
        ingredients: updated,
        calories: round(nutrition.calories),
        carbs: round(nutrition.carbs),
        fat: round(nutrition.fat),
      });
    },
    [uid, recipe.id, ingredientsMap],
  );

  const nutrition = calculateRecipeNutrition(recipe.ingredients, ingredientsMap);
  const availableIngredients = ingredients.filter((i) => !recipe.ingredients.some((ri) => ri.ingredientId === i.id));

  return (
    <div className="space-y-4">
      {baseRecipeName && (
        <div className="text-xs text-base-content/50">
          {TEXTS.recipes.basedOn}: {baseRecipeName}
        </div>
      )}
      {editingHeader ? (
        <RecipeHeaderForm
          uid={uid}
          recipeId={recipe.id}
          name={recipe.name}
          amount={recipe.amount}
          servings={recipe.servings}
          onClose={() => setEditingHeader(false)}
        />
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">{recipe.name}</h3>
            <div className="text-sm text-base-content/70">
              {recipe.amount ? `${recipe.amount}g` : '—'} · {recipe.servings} {TEXTS.recipes.servings.toLowerCase()} ·{' '}
              {formatNutrition(nutrition)}
            </div>
          </div>
          <button onClick={() => setEditingHeader(true)} className="btn btn-ghost btn-xs">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-semibold">{TEXTS.recipes.ingredients}</h4>
        <AddIngredientRow
          recipeIngredients={recipe.ingredients}
          available={availableIngredients}
          onSave={saveIngredients}
          onAdded={setFocusIngredientId}
        />
        {recipe.ingredients.length === 0 ? (
          <p className="text-base-content/50 py-4 text-center">{TEXTS.recipes.noIngredients}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm">
              <thead>
                <tr>
                  <th>{TEXTS.recipes.ingredient}</th>
                  <th className="text-right">{TEXTS.recipes.amountG}</th>
                  <th className="text-right">{TEXTS.nutrients.cal}</th>
                  <th className="text-right">{TEXTS.nutrients.ch}</th>
                  <th className="text-right">{TEXTS.nutrients.fat}</th>
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
                    autoFocus={focusIngredientId === ri.ingredientId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button onClick={onClose} className="btn btn-ghost btn-sm">
          {TEXTS.common.cancel}
        </button>
      </div>
    </div>
  );
}

function RecipeHeaderForm({
  uid,
  recipeId,
  name,
  amount,
  servings,
  onClose,
}: {
  uid: string;
  recipeId: string;
  name: string;
  amount: number | null;
  servings: number;
  onClose: () => void;
}) {
  const [editName, setEditName] = useState(name);
  const [editAmount, setEditAmount] = useState(amount?.toString() ?? '');
  const [editServings, setEditServings] = useState(servings.toString());
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editName.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await updateRecipe(uid, recipeId, {
        name: trimmed,
        amount: editAmount ? parseFloat(editAmount) : null,
        servings: parseInt(editServings) || 1,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <table className="table">
        <tbody>
          <tr>
            <td className="font-medium">{TEXTS.common.name}</td>
            <td>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input input-bordered input-sm w-full"
                required
                autoFocus
              />
            </td>
          </tr>
          <tr>
            <td className="font-medium">{TEXTS.recipes.amountG}</td>
            <td>
              <input
                type="number"
                min="0"
                step="1"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                placeholder="—"
                className="input input-bordered input-sm w-full"
              />
            </td>
          </tr>
          <tr>
            <td className="font-medium">{TEXTS.recipes.servings}</td>
            <td>
              <input
                type="number"
                min="1"
                step="1"
                value={editServings}
                onChange={(e) => setEditServings(e.target.value)}
                className="input input-bordered input-sm w-full"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">
          {TEXTS.common.cancel}
        </button>
        <button type="submit" disabled={saving || !editName.trim()} className="btn btn-primary btn-sm">
          {saving ? TEXTS.common.saving : TEXTS.common.save}
        </button>
      </div>
    </form>
  );
}

function AddIngredientRow({
  recipeIngredients,
  available,
  onSave,
  onAdded,
}: {
  recipeIngredients: RecipeIngredient[];
  available: Ingredient[];
  onSave: (ingredients: RecipeIngredient[]) => Promise<void>;
  onAdded: (ingredientId: string) => void;
}) {
  const [saving, setSaving] = useState(false);

  const handleSelect = async (ingredient: Ingredient) => {
    setSaving(true);
    try {
      onAdded(ingredient.id);
      await onSave([...recipeIngredients, { ingredientId: ingredient.id, name: ingredient.name, amount: 0 }]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="flex-1">
        <IngredientSelector ingredients={available} onSelect={handleSelect} placeholder={TEXTS.recipes.addIngredient} />
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
  autoFocus,
}: {
  ri: RecipeIngredient;
  ingredient: Ingredient | undefined;
  allIngredients: RecipeIngredient[];
  onSave: (ingredients: RecipeIngredient[]) => Promise<void>;
  autoFocus?: boolean;
}) {
  const [editAmount, setEditAmount] = useState(ri.amount ? ri.amount.toString() : '');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 0);
  }, [autoFocus]);

  const nutrition = ingredient ? calculateIngredientNutrition(ingredient, ri.amount) : { calories: 0, carbs: 0, fat: 0 };

  const handleBlur = async () => {
    const newAmount = parseFloat(editAmount);
    if (!newAmount || newAmount <= 0 || newAmount === ri.amount) return;
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
        <input
          ref={inputRef}
          data-ingredient-id={ri.ingredientId}
          type="number"
          min="0"
          step="1"
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
          onBlur={handleBlur}
          className="input input-bordered input-sm text-right"
        />
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
