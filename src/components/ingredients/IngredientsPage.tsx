import { useState, useMemo, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import {
  readIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  refreshIngredientsIfNeeded,
} from '../../services/ingredients';
import { readRecipes } from '../../services/recipes';
import { readDays } from '../../services/days';
import { useDebounce } from '../../hooks/useDebounce';
import { TEXTS } from '../../constants/texts';
import { formatDate } from '../../utils/format';
import IngredientDialog from './IngredientDialog';
import ConfirmDialog from '../ConfirmDialog';
import PageHeader from '../PageHeader';
import IngredientRow from './IngredientRow';
import type { Ingredient, NewIngredient } from '../../types/ingredient';

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState(readIngredients);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 200);
  const [editing, setEditing] = useState<Ingredient | 'new' | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    refreshIngredientsIfNeeded().then((updated) => updated && setIngredients(updated));
  }, []);

  const sorted = useMemo(() => [...ingredients].sort((i1, i2) => i1.name.localeCompare(i2.name)), [ingredients]);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return sorted;
    const q = debouncedQuery.toLowerCase();
    return sorted.filter((ingredient) => ingredient.name.toLowerCase().includes(q));
  }, [sorted, debouncedQuery]);

  const closeDialog = () => setEditing(null);

  const handleSave = async (data: NewIngredient) => {
    if (editing === 'new') {
      setIngredients(createIngredient(data));
    } else if (editing) {
      setIngredients(updateIngredient(editing.id, data));
    }
    closeDialog();
  };

  const getUsageLines = (id: string): string[] => {
    const lines: string[] = [];
    const recipes = readRecipes();
    const usedInRecipes = recipes.filter((recipe) => recipe.ingredients.some((ri) => ri.ingredientId === id));
    if (usedInRecipes.length > 0) {
      lines.push(`${TEXTS.confirm.usedInRecipes}: ${usedInRecipes.map((recipe) => recipe.name).join(', ')}`);
    }
    const days = readDays();
    const usedInDays = days.filter((day) => day.meals.some((meal) => meal.dishes.some((dish) => dish.ingredientId === id)));
    if (usedInDays.length > 0) {
      lines.push(`${TEXTS.confirm.usedInDays}: ${usedInDays.map((day) => formatDate(day.date)).join(', ')}`);
    }
    return lines;
  };

  const handleDelete = async (id: string) => {
    const lines = getUsageLines(id);
    if (lines.length > 0) {
      setConfirmDeleteId(id);
      return;
    }
    setDeletingId(id);
    setIngredients(await deleteIngredient(id));
    setDeletingId(null);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    setConfirmDeleteId(null);
    setDeletingId(confirmDeleteId);
    setIngredients(await deleteIngredient(confirmDeleteId));
    setDeletingId(null);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <PageHeader
        title={TEXTS.nav.ingredients}
        search={
          <label className="input input-bordered input-sm flex items-center gap-2">
            <Search className="w-4 h-4 opacity-50" />
            <input
              type="text"
              placeholder={TEXTS.ingredients.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="grow"
            />
          </label>
        }
      >
        <button onClick={() => setEditing('new')} data-testid="create-button" className="btn btn-primary btn-sm">
          <Plus className="w-4 h-4" />
        </button>
      </PageHeader>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">
          {ingredients.length === 0 ? TEXTS.ingredients.noIngredients : TEXTS.common.noMatches}
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className="w-full sticky left-0 top-0 z-[2] bg-base-200">{TEXTS.common.name}</th>
                <th className="text-right whitespace-nowrap sticky top-0 bg-base-200">{TEXTS.nutrients.cal}</th>
                <th className="text-right whitespace-nowrap sticky top-0 bg-base-200">{TEXTS.nutrients.ch}</th>
                <th className="text-right whitespace-nowrap sticky top-0 bg-base-200">{TEXTS.nutrients.fat}</th>
                <th className="text-right whitespace-nowrap sticky top-0 bg-base-200">{TEXTS.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ing) => (
                <IngredientRow
                  key={ing.id}
                  ingredient={ing}
                  onEdit={() => setEditing(ing)}
                  onDelete={() => handleDelete(ing.id)}
                  deleting={deletingId === ing.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <IngredientDialog editing={editing} onSave={handleSave} onClose={closeDialog} />

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title={TEXTS.confirm.deleteIngredient}
        lines={confirmDeleteId ? getUsageLines(confirmDeleteId) : []}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
