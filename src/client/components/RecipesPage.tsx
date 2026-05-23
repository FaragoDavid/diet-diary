import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Plus, Trash2, Pencil } from 'lucide-react';
import { useRecipes, createRecipe, deleteRecipe } from '../services/recipes';
import { useIngredients } from '../services/ingredients';
import { useDebounce } from '../hooks/useDebounce';
import RecipeDialog from './RecipeDialog';
import { round } from '../utils/nutrition';
import { TEXTS } from '../constants/texts';

export default function RecipesPage({ uid }: { uid: string }) {
  const { recipes, loading, error } = useRecipes(uid);
  const { ingredients } = useIngredients(uid);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 200);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return recipes;
    const q = debouncedQuery.toLowerCase();
    return recipes.filter((r) => r.name.toLowerCase().includes(q));
  }, [recipes, debouncedQuery]);

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
    const id = await createRecipe(uid, '');
    setIsNew(true);
    setSelectedId(id);
  };

  const handleCloseDialog = () => {
    if (isNew && selectedRecipe && !selectedRecipe.name.trim()) {
      deleteRecipe(uid, selectedRecipe.id);
    }
    closeDialog();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteRecipe(uid, id);
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>
          {TEXTS.recipes.loadError}: {error}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{TEXTS.nav.recipes}</h2>
        <button onClick={handleCreate} className="btn btn-primary btn-sm">
          <Plus className="w-4 h-4" />
          {TEXTS.common.add}
        </button>
      </div>

      <div className="form-control">
        <label className="input input-bordered flex items-center gap-2">
          <Search className="w-4 h-4 opacity-50" />
          <input
            type="text"
            placeholder={TEXTS.recipes.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="grow"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">
          {recipes.length === 0 ? TEXTS.recipes.noRecipes : TEXTS.common.noMatches}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>{TEXTS.common.name}</th>
                <th className="text-right">{TEXTS.nutrients.cal}</th>
                <th className="text-right">{TEXTS.nutrients.ch}</th>
                <th className="text-right">{TEXTS.nutrients.fat}</th>
                <th className="text-right">{TEXTS.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((recipe) => (
                <tr key={recipe.id}>
                  <td>
                    <button onClick={() => setSelectedId(recipe.id)} className="link link-hover font-medium">
                      {recipe.name}
                    </button>
                    <div className="text-xs text-base-content/50">
                      {recipe.amount != null && <span>{recipe.amount}g · </span>}
                      {TEXTS.recipes.nIngredients(recipe.ingredients.length)}
                    </div>
                  </td>
                  <td className="text-right tabular-nums">{round(recipe.calories)}</td>
                  <td className="text-right tabular-nums">{round(recipe.carbs)}</td>
                  <td className="text-right tabular-nums">{round(recipe.fat)}</td>
                  <td className="text-right">
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

      <div className="text-sm text-base-content/50 text-right">
        {filtered.length} / {recipes.length}
      </div>

      <dialog ref={dialogRef} className="modal" onClose={handleCloseDialog}>
        <div className="modal-box">
          {selectedRecipe && (
            <RecipeDialog
              uid={uid}
              recipe={selectedRecipe}
              ingredients={ingredients}
              onClose={handleCloseDialog}
              initialEditHeader={isNew}
            />
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
