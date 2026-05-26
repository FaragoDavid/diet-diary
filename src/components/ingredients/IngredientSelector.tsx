import { useState, useRef, useMemo } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { round } from '../../utils/format';
import { TEXTS } from '../../constants/texts';
import type { Ingredient } from '../../types/ingredient';

interface IngredientSelectorProps {
  ingredients: Ingredient[];
  onSelect: (ingredient: Ingredient) => void | Promise<void>;
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
  const [saving, setSaving] = useState(false);
  const debouncedQuery = useDebounce(query, 150);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return ingredients.filter((ing) => ing.name.toLowerCase().includes(q)).slice(0, maxResults);
  }, [ingredients, debouncedQuery, maxResults]);

  const handleSelect = async (ingredient: Ingredient) => {
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
    const result = onSelect(ingredient);
    if (result instanceof Promise) {
      setSaving(true);
      try {
        await result;
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="relative flex-1">
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
          <ul className="bg-base-100 shadow-lg rounded-box absolute z-50 w-full mt-1 max-h-60 overflow-y-auto p-2">
            {results.map((ing) => (
              <button
                key={ing.id}
                type="button"
                onMouseDown={() => handleSelect(ing)}
                className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-base-200 text-sm"
              >
                <span>{ing.name}</span>
                <span className="text-xs text-base-content/50 ml-2 shrink-0">
                  {round(ing.caloriesPer100)} {TEXTS.nutrients.kcalUnit} · {round(ing.carbsPer100)} {TEXTS.nutrients.chUnit} ·{' '}
                  {round(ing.fatPer100)} {TEXTS.nutrients.fatUnit}
                </span>
              </button>
            ))}
          </ul>
        )}
        {open && debouncedQuery && results.length === 0 && (
          <div className="bg-base-100 shadow-lg rounded-box absolute z-50 w-full mt-1 p-3 text-sm text-base-content/50">
            {TEXTS.ingredients.noFound}
          </div>
        )}
      </div>
      {saving && <span className="loading loading-spinner loading-sm shrink-0"></span>}
    </div>
  );
}
