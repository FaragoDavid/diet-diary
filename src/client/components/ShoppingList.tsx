import { useMemo, useState } from 'react';
import { Copy, Check, Package } from 'lucide-react';
import { aggregateIngredients } from './IngredientAggregation';
import { round } from '../utils/nutrition';
import { TEXTS } from '../constants/texts';
import type { Day } from '../types/day';
import type { Ingredient } from '../types/ingredient';
import type { Recipe } from '../types/recipe';

export default function ShoppingList({
  days,
  ingredientsMap,
  recipesMap,
}: {
  days: Day[];
  ingredientsMap: Map<string, Ingredient>;
  recipesMap: Map<string, Recipe>;
}) {
  const [hideInStock, setHideInStock] = useState(false);
  const [copied, setCopied] = useState(false);

  const aggregated = useMemo(() => aggregateIngredients(days, ingredientsMap, recipesMap), [days, ingredientsMap, recipesMap]);

  const items = useMemo(() => {
    return aggregated
      .map((agg) => {
        const ingredient = ingredientsMap.get(agg.ingredientId);
        return { ...agg, inStock: ingredient?.inStock ?? false };
      })
      .filter((item) => !hideInStock || !item.inStock);
  }, [aggregated, ingredientsMap, hideInStock]);

  const exportText = items.map((item) => `${item.name}: ${round(item.totalAmount)}g`).join('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (aggregated.length === 0) {
    return <p className="text-center py-8 text-base-content/50">{TEXTS.shoppingList.noData}</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="label cursor-pointer gap-2">
          <input type="checkbox" checked={hideInStock} onChange={(e) => setHideInStock(e.target.checked)} className="toggle toggle-sm" />
          <span className="label-text">{TEXTS.shoppingList.hideInStock}</span>
        </label>
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
              <th className="text-center">{TEXTS.shoppingList.status}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.ingredientId} className={item.inStock ? 'opacity-50' : ''}>
                <td className="font-medium">{item.name}</td>
                <td className="text-right tabular-nums">{round(item.totalAmount)}</td>
                <td className="text-center">
                  {item.inStock ? (
                    <span className="badge badge-sm badge-success gap-1">
                      <Package className="w-3 h-3" /> {TEXTS.shoppingList.inStock}
                    </span>
                  ) : (
                    <span className="badge badge-sm badge-warning">{TEXTS.shoppingList.need}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-base-content/50 text-right">
        {TEXTS.shoppingList.summary(items.length, items.filter((i) => !i.inStock).length)}
      </div>
    </div>
  );
}
