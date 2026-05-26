import { useMemo } from 'react';
import { round } from '../../utils/nutrition';
import { TEXTS } from '../../constants/texts';
import type { Day } from '../../types/day';
import type { Ingredient } from '../../types/ingredient';
import type { Recipe } from '../../types/recipe';

interface AggregatedIngredient {
  ingredientId: string;
  name: string;
  totalAmount: number;
}

export default function ShoppingList({
  days,
  ingredientsMap,
  recipesMap,
  multiplier = 1,
}: {
  days: Day[];
  ingredientsMap: Map<string, Ingredient>;
  recipesMap: Map<string, Recipe>;
  multiplier?: number;
}) {
  const items = useMemo(() => aggregateIngredients(days, ingredientsMap, recipesMap), [days, ingredientsMap, recipesMap]);

  if (items.length === 0) {
    return <p className="text-center py-8 text-base-content/50">{TEXTS.shoppingList.noData}</p>;
  }

  return (
    <div className="space-y-3">
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
                <td className="text-right tabular-nums">{round(item.totalAmount * multiplier)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function aggregateIngredients(
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
