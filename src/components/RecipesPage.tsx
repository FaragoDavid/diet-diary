import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Plus, Trash2, Pencil } from 'lucide-react';
import { useRecipes, createRecipe, deleteRecipe } from '../services/recipes';
import { useIngredients } from '../services/ingredients';
import { useDays } from '../services/days';
import { useDebounce } from '../hooks/useDebounce';
import RecipeDialog from './RecipeDialog';
import ConfirmDialog from './ConfirmDialog';
import { round } from '../utils/nutrition';
import { formatDate } from '../utils/format';
import { TEXTS } from '../constants/texts';
import PageHeader from './PageHeader';

export default function RecipesPage() {
  const { recipes } = useRecipes();
  const { ingredients } = useIngredients();
  const { days } = useDays();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 200);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const baseRecipes = useMemo(() => recipes.filter((r) => !r.baseRecipeId), [recipes]);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return baseRecipes;
    const q = debouncedQuery.toLowerCase();
    return baseRecipes.filter((r) => r.name.toLowerCase().includes(q));
  }, [baseRecipes, debouncedQuery]);

  const selectedRecipe = selectedId ? (recipes.find((r) => r.id === selectedId) ?? null) : null;

  useEffect(() => {
    if (selectedRecipe) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [selectedRecipe]);

  const closeDialog = () => {
    setSelectedId(null);
    setIsNew(false);
  };

  const handleCreate = async () => {
    const id = await createRecipe('');
    setIsNew(true);
    setSelectedId(id);
  };

  const handleCloseDialog = () => {
    if (isNew && selectedRecipe && !selectedRecipe.name.trim()) {
      deleteRecipe(selectedRecipe.id);
    }
    closeDialog();
  };

  const getUsageLines = (id: string): string[] => {
    const usedInDays = days.filter((d) => d.meals.some((m) => m.dishes.some((dish) => dish.recipeId === id)));
    if (usedInDays.length > 0) {
      return [`${TEXTS.confirm.usedInDays}: ${usedInDays.map((d) => formatDate(d.date)).join(', ')}`];
    }
    return [];
  };

  const handleDelete = async (id: string) => {
    const lines = getUsageLines(id);
    if (lines.length > 0) {
      setConfirmDeleteId(id);
      return;
    }
    setDeletingId(id);
    await deleteRecipe(id);
    setDeletingId(null);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    setConfirmDeleteId(null);
    setDeletingId(confirmDeleteId);
    await deleteRecipe(confirmDeleteId);
    setDeletingId(null);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <PageHeader
        title={TEXTS.nav.recipes}
        search={
          <label className="input input-bordered input-sm flex items-center gap-2">
            <Search className="w-4 h-4 opacity-50" />
            <input
              type="text"
              placeholder={TEXTS.recipes.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="grow"
            />
          </label>
        }
      >
        <button onClick={handleCreate} className="btn btn-primary btn-sm">
          <Plus className="w-4 h-4" />
        </button>
      </PageHeader>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">
          {recipes.length === 0 ? TEXTS.recipes.noRecipes : TEXTS.common.noMatches}
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className="sticky left-0 top-0 z-[2] bg-base-200">{TEXTS.common.name}</th>
                <th className="text-right whitespace-nowrap sticky top-0 bg-base-200">{TEXTS.nutrients.cal}</th>
                <th className="text-right whitespace-nowrap sticky top-0 bg-base-200">{TEXTS.nutrients.ch}</th>
                <th className="text-right whitespace-nowrap sticky top-0 bg-base-200">{TEXTS.nutrients.fat}</th>
                <th className="text-right whitespace-nowrap sticky top-0 bg-base-200">{TEXTS.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((recipe) => (
                <tr key={recipe.id}>
                  <td className="sticky left-0 z-[1] bg-base-200">
                    <button onClick={() => setSelectedId(recipe.id)} className="link link-hover font-medium text-left">
                      {recipe.name}
                    </button>
                  </td>
                  <td className="text-right tabular-nums whitespace-nowrap">{round(recipe.calories)}</td>
                  <td className="text-right tabular-nums whitespace-nowrap">{round(recipe.carbs)}</td>
                  <td className="text-right tabular-nums whitespace-nowrap">{round(recipe.fat)}</td>
                  <td className="text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setSelectedId(recipe.id)} className="btn btn-ghost btn-xs">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        disabled={deletingId === recipe.id}
                        className="btn btn-ghost btn-xs text-error"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <dialog ref={dialogRef} className="modal" onClose={handleCloseDialog}>
        <div className="modal-box">
          {selectedRecipe && (
            <RecipeDialog
              recipe={selectedRecipe}
              ingredients={ingredients}
              recipes={recipes}
              onClose={handleCloseDialog}
              initialEditHeader={isNew}
            />
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title={TEXTS.confirm.deleteRecipe}
        lines={confirmDeleteId ? getUsageLines(confirmDeleteId) : []}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}
