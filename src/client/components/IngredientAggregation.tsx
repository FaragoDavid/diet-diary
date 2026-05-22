import { useMemo } from 'react';
import { round } from '../utils/nutrition';
import { TEXTS } from '../constants/texts';
import type { Day } from '../types/day';
import type { Ingredient } from '../types/ingredient';
import type { Recipe } from '../types/recipe';

interface AggregatedIngredient {
  ingredientId: string;
  name: string;
  totalAmount: number;
  sources: { day: string; meal: string; dish: string; amount: number }[];
}

export default function IngredientAggregation({
  days,
  ingredientsMap,
  recipesMap,
}: {
  days: Day[];
  ingredientsMap: Map<string, Ingredient>;
  recipesMap: Map<string, Recipe>;
}) {
  const aggregated = useMemo(() => aggregateIngredients(days, ingredientsMap, recipesMap), [days, ingredientsMap, recipesMap]);

  if (aggregated.length === 0) {
    return <p className="text-center py-8 text-base-content/50">{TEXTS.ingredientAgg.noData}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>{TEXTS.ingredientAgg.ingredient}</th>
            <th className="text-right">{TEXTS.ingredientAgg.totalG}</th>
            <th className="text-right">{TEXTS.ingredientAgg.usedIn}</th>
          </tr>
        </thead>
        <tbody>
          {aggregated.map((agg) => (
            <tr key={agg.ingredientId}>
              <td className="font-medium">{agg.name}</td>
              <td className="text-right tabular-nums">{round(agg.totalAmount)}</td>
              <td className="text-right">{TEXTS.ingredientAgg.nDishes(agg.sources.length)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th>{TEXTS.ingredientAgg.total}</th>
            <th className="text-right tabular-nums">{round(aggregated.reduce((s, a) => s + a.totalAmount, 0))}</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
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
          addToMap(map, dish.ingredientId, ing?.name ?? dish.name, dish.amount, day.date, meal.type, dish.name);
        } else if (dish.recipeId) {
          const recipe = recipesMap.get(dish.recipeId);
          if (recipe) {
            const factor = recipe.amount ? dish.amount / recipe.amount : dish.amount / 100;
            for (const ri of recipe.ingredients) {
              const ing = ingredientsMap.get(ri.ingredientId);
              addToMap(map, ri.ingredientId, ing?.name ?? ri.name, ri.amount * factor, day.date, meal.type, dish.name);
            }
          }
        }
      }
    }
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function addToMap(
  map: Map<string, AggregatedIngredient>,
  ingredientId: string,
  name: string,
  amount: number,
  day: string,
  meal: string,
  dish: string,
) {
  const existing = map.get(ingredientId);
  if (existing) {
    existing.totalAmount += amount;
    existing.sources.push({ day, meal, dish, amount });
  } else {
    map.set(ingredientId, { ingredientId, name, totalAmount: amount, sources: [{ day, meal, dish, amount }] });
  }
}
