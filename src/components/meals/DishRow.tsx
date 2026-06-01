import { useState, useRef, useEffect, useMemo } from 'react';
import { Trash2, GitBranch } from 'lucide-react';
import { readIngredients } from '../../services/ingredients';
import { readRecipes, createVariant } from '../../services/recipes';
import { calculateIngredientNutrition, calculateRecipeNutrition, buildIngredientMap } from '../../utils/nutrition';
import { round } from '../../utils/format';
import { TEXTS } from '../../constants/texts';
import type { Dish } from '../../types/day';

export default function DishRow({
  dish,
  allDishes,
  onSave,
  onEditVariant,
  autoFocus,
}: {
  dish: Dish;
  allDishes: Dish[];
  onSave: (dishes: Dish[]) => Promise<void>;
  onEditVariant: (variantId: string) => void;
  autoFocus?: boolean;
}) {
  const ingredients = useMemo(() => readIngredients(), []);
  const recipes = useMemo(() => readRecipes(), []);
  const ingredientsMap = useMemo(() => buildIngredientMap(ingredients, recipes), [ingredients, recipes]);
  const recipesMap = useMemo(() => new Map(recipes.map((recipe) => [recipe.id, recipe])), [recipes]);
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
        const nutrition = calculateRecipeNutrition(recipe.ingredients, ingredientsMap);
        const factor = recipe.amount ? amount / recipe.amount : amount / 100;
        return { calories: nutrition.calories * factor, carbs: nutrition.carbs * factor, fat: nutrition.fat * factor };
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
    const nutrition = computeNutrition(newAmount);
    setSaving(true);
    try {
      await onSave(
        allDishes.map((existing) =>
          existing.id === dish.id
            ? {
                ...existing,
                amount: newAmount,
                calories: round(nutrition.calories),
                carbs: round(nutrition.carbs),
                fat: round(nutrition.fat),
              }
            : existing,
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await onSave(allDishes.filter((existing) => existing.id !== dish.id));
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
      const { id: variantId } = createVariant(recipe);
      await onSave(allDishes.map((existing) => (existing.id === dish.id ? { ...existing, recipeId: variantId } : existing)));
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
          onChange={(event) => setEditAmount(event.target.value)}
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
            <button
              onClick={handleCustomize}
              disabled={saving}
              data-testid="customize-button"
              className="btn btn-ghost btn-xs"
              title={TEXTS.meals.customize}
            >
              <GitBranch className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={handleDelete} disabled={saving} data-testid="delete-button" className="btn btn-ghost btn-xs text-error">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
