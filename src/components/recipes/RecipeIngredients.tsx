import { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { calculateIngredientNutrition } from '../../utils/nutrition';
import { round } from '../../utils/format';
import { TEXTS } from '../../constants/texts';
import type { RecipeIngredient } from '../../types/recipe';
import type { Ingredient } from '../../types/ingredient';

function IngredientRow({
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
      await onSave(
        allIngredients.map((existing) => (existing.ingredientId === ri.ingredientId ? { ...existing, amount: newAmount } : existing)),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await onSave(allIngredients.filter((existing) => existing.ingredientId !== ri.ingredientId));
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
          onChange={(event) => setEditAmount(event.target.value)}
          onBlur={handleBlur}
          className="input input-bordered input-sm text-right"
        />
      </td>
      <td className="text-right tabular-nums">{round(nutrition.calories)}</td>
      <td className="text-right tabular-nums">{round(nutrition.carbs)}</td>
      <td className="text-right tabular-nums">{round(nutrition.fat)}</td>
      <td>
        <button onClick={handleDelete} disabled={saving} data-testid="delete-button" className="btn btn-ghost btn-xs text-error">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}

export default function RecipeIngredients({
  ingredients,
  nutritionMap,
  onSave,
  focusIngredientId,
}: {
  ingredients: RecipeIngredient[];
  nutritionMap: Map<string, Ingredient>;
  onSave: (ingredients: RecipeIngredient[]) => Promise<void>;
  focusIngredientId: string | null;
}) {
  if (ingredients.length === 0) {
    return <p className="text-base-content/50 py-4 text-center">{TEXTS.recipes.noIngredients}</p>;
  }

  return (
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
          {ingredients.map((ri) => (
            <IngredientRow
              key={ri.ingredientId}
              ri={ri}
              ingredient={nutritionMap.get(ri.ingredientId)}
              allIngredients={ingredients}
              onSave={onSave}
              autoFocus={focusIngredientId === ri.ingredientId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
