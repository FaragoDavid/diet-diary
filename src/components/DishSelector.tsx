import { useState, useRef, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { readIngredients } from '../services/ingredients';
import { readRecipes } from '../services/recipes';
import { round } from '../utils/format';
import { TEXTS } from '../constants/texts';

export interface DishSelection {
  type: 'ingredient' | 'recipe';
  id: string;
  name: string;
}

interface DishSelectorProps {
  onSelect: (selection: DishSelection) => void;
  placeholder?: string;
  maxResults?: number;
}

export default function DishSelector({ onSelect, placeholder = TEXTS.meals.addDish, maxResults = 15 }: DishSelectorProps) {
  const ingredients = useMemo(() => readIngredients(), []);
  const recipes = useMemo(() => readRecipes(), []);
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
          subtitle = r.amount ? `${round(r.amount)}g` : base ? `${TEXTS.recipes.variant}` : null;
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
        <ul className="bg-base-100 shadow-lg rounded-box absolute z-50 w-full mt-1 max-h-60 overflow-y-auto p-2">
          {results.map((item) => (
            <button
              key={`${item.type}:${item.id}`}
              type="button"
              onMouseDown={() => handleSelect(item)}
              className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-base-200 text-sm overflow-hidden"
            >
              <span className="truncate">
                {item.name}
                {item.subtitle && <span className="text-xs text-base-content/50 ml-1">({item.subtitle})</span>}
              </span>
              <span className="text-xs text-base-content/50 ml-2 shrink-0">
                {item.type === 'ingredient' ? TEXTS.dishes.ingredient : TEXTS.dishes.recipe}
              </span>
            </button>
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
