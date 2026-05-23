import { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { round } from '../utils/nutrition';
import { TEXTS } from '../constants/texts';
import type { Day } from '../types/day';
import type { Ingredient } from '../types/ingredient';
import type { Recipe } from '../types/recipe';

interface AggregatedIngredient {
  ingredientId: string;
  name: string;
  totalAmount: number;
}

export default function ShoppingList({
  days,
  ingredientsMap,
  recipesMap,
}: {
  days: Day[];
  ingredientsMap: Map<string, Ingredient>;
  recipesMap: Map<string, Recipe>;
}) {
  const [copied, setCopied] = useState(false);

  const items = useMemo(() => aggregateIngredients(days, ingredientsMap, recipesMap), [days, ingredientsMap, recipesMap]);

  const exportText = items.map((item) => `${item.name}: ${round(item.totalAmount)}g`).join('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (items.length === 0) {
    return <p className="text-center py-8 text-base-content/50">{TEXTS.shoppingList.noData}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={handleCopy} className="btn btn-sm btn-outline gap-1">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? TEXTS.shoppingList.copied : TEXTS.shoppingList.copyList}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>{TEXTS.shoppingList.ingredient}</th>
              <th className="text-right">{TEXTS.shoppingList.amountG}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.ingredientId}>
                <td className="font-medium">{item.name}</td>
                <td className="text-right tabular-nums">{round(item.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-base-content/50 text-right">{items.length} {TEXTS.shoppingList.itemCount}</div>
    </div>
  );
}

function aggregateIngredients(
  days: Day[],
  ingredientsMap: Map<string, Ingredient>,
  recipesMap: Map<string, Recipe>,
): AggregatedIngredient[] {
  const map = new Map<string, AggregatedIngredient>();

  for (const day of days) {
    for (const meal of day.meals) {
      for (const dish of meal.dishes) {
        if (dish.ingredientId) {
          const ing = ingredientsMap.get(dish.ingredientId);
          addToMap(map, dish.ingredientId, ing?.name ?? dish.name, dish.amount);
        } else if (dish.recipeId) {
          const recipe = recipesMap.get(dish.recipeId);
          if (recipe) {
            const factor = recipe.amount ? dish.amount / recipe.amount : dish.amount / 100;
            for (const ri of recipe.ingredients) {
              const ing = ingredientsMap.get(ri.ingredientId);
              addToMap(map, ri.ingredientId, ing?.name ?? ri.name, ri.amount * factor);
            }
          }
        }
      }
    }
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function addToMap(map: Map<string, AggregatedIngredient>, ingredientId: string, name: string, amount: number): void {
  const existing = map.get(ingredientId);
  if (existing) {
    existing.totalAmount += amount;
  } else {
    map.set(ingredientId, { ingredientId, name, totalAmount: amount });
  }
}
