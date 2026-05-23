import { useState, useRef, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { TEXTS } from '../constants/texts';
import type { Ingredient } from '../types/ingredient';
import type { Recipe } from '../types/recipe';

export interface DishSelection {
  type: 'ingredient' | 'recipe';
  id: string;
  name: string;
}

interface DishSelectorProps {
  ingredients: Ingredient[];
  recipes: Recipe[];
  onSelect: (selection: DishSelection) => void;
  placeholder?: string;
  maxResults?: number;
}

export default function DishSelector({
  ingredients,
  recipes,
  onSelect,
  placeholder = TEXTS.meals.addDish,
  maxResults = 15,
}: DishSelectorProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 150);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    const recipesMap = new Map(recipes.map((r) => [r.id, r]));
    const matchedIngredients = ingredients
      .filter((i) => i.name.toLowerCase().includes(q))
      .map((i) => ({ type: 'ingredient' as const, id: i.id, name: i.name, subtitle: null }));
    const matchedRecipes = recipes
      .filter((r) => r.name.toLowerCase().includes(q))
      .map((r) => {
        let subtitle: string | null = null;
        if (r.baseRecipeId) {
          const base = recipesMap.get(r.baseRecipeId);
          subtitle = r.amount ? `${r.amount}g` : base ? `${TEXTS.recipes.variant}` : null;
        }
        return { type: 'recipe' as const, id: r.id, name: r.name, subtitle };
      });
    return [...matchedIngredients, ...matchedRecipes].slice(0, maxResults);
  }, [ingredients, recipes, debouncedQuery, maxResults]);

  const handleSelect = (item: (typeof results)[number]) => {
    onSelect({ type: item.type, id: item.id, name: item.name });
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder={placeholder}
        className="input input-bordered input-sm w-full"
      />
      {open && results.length > 0 && (
        <ul className="menu bg-base-100 shadow-lg rounded-box absolute z-50 w-full mt-1 max-h-60 overflow-y-auto">
          {results.map((item) => (
            <li key={`${item.type}:${item.id}`}>
              <button type="button" onMouseDown={() => handleSelect(item)} className="flex justify-between">
                <span>
                  {item.name}
                  {item.subtitle && <span className="text-xs text-base-content/50 ml-1">({item.subtitle})</span>}
                </span>
                <span className="text-xs text-base-content/50">
                  {item.type === 'ingredient' ? TEXTS.dishes.ingredient : TEXTS.dishes.recipe}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && debouncedQuery && results.length === 0 && (
        <div className="bg-base-100 shadow-lg rounded-box absolute z-50 w-full mt-1 p-3 text-sm text-base-content/50">
          {TEXTS.common.noMatches}
        </div>
      )}
    </div>
  );
}
