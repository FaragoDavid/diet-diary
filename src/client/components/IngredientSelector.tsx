import { useState, useRef, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { TEXTS } from '../constants/texts';
import type { Ingredient } from '../types/ingredient';

interface IngredientSelectorProps {
  ingredients: Ingredient[];
  onSelect: (ingredient: Ingredient) => void;
  placeholder?: string;
  maxResults?: number;
}

export default function IngredientSelector({
  ingredients,
  onSelect,
  placeholder = TEXTS.ingredients.search,
  maxResults = 15,
}: IngredientSelectorProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 150);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return ingredients.filter((i) => i.name.toLowerCase().includes(q)).slice(0, maxResults);
  }, [ingredients, debouncedQuery, maxResults]);

  const handleSelect = (ingredient: Ingredient) => {
    onSelect(ingredient);
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
        className="input input-bordered w-full"
      />
      {open && results.length > 0 && (
        <ul className="menu bg-base-100 shadow-lg rounded-box absolute z-50 w-full mt-1 max-h-60 overflow-y-auto">
          {results.map((ing) => (
            <li key={ing.id}>
              <button type="button" onMouseDown={() => handleSelect(ing)} className="flex justify-between">
                <span>{ing.name}</span>
                <span className="text-xs text-base-content/50">
                  {ing.caloriesPer100} {TEXTS.nutrients.cal.toLowerCase()} · {ing.carbsPer100} {TEXTS.nutrients.ch.toLowerCase()} ·{' '}
                  {ing.fatPer100} {TEXTS.nutrients.fat.toLowerCase()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && debouncedQuery && results.length === 0 && (
        <div className="bg-base-100 shadow-lg rounded-box absolute z-50 w-full mt-1 p-3 text-sm text-base-content/50">
          {TEXTS.ingredients.noFound}
        </div>
      )}
    </div>
  );
}
