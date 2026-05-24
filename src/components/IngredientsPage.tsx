import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useIngredients, createIngredient, updateIngredient, deleteIngredient } from '../services/ingredients';
import { useRecipes } from '../services/recipes';
import { useDays } from '../services/days';
import { useDebounce } from '../hooks/useDebounce';
import { TEXTS } from '../constants/texts';
import { formatDate } from '../utils/format';
import IngredientForm from './IngredientForm';
import ConfirmDialog from './ConfirmDialog';
import PageHeader from './PageHeader';
import type { Ingredient, NewIngredient } from '../types/ingredient';

export default function IngredientsPage() {
  const { ingredients } = useIngredients();
  const { recipes } = useRecipes();
  const { days } = useDays();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 200);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return ingredients;
    const q = debouncedQuery.toLowerCase();
    return ingredients.filter((i) => i.name.toLowerCase().includes(q));
  }, [ingredients, debouncedQuery]);

  const dialogOpen = showAddForm || editingIngredient !== null;

  useEffect(() => {
    if (dialogOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [dialogOpen]);

  const closeDialog = () => {
    setShowAddForm(false);
    setEditingIngredient(null);
  };

  const handleAdd = async (data: NewIngredient) => {
    await createIngredient(data);
    closeDialog();
  };

  const handleUpdate = async (id: string, data: NewIngredient) => {
    await updateIngredient(id, data);
    closeDialog();
  };

  const getUsageLines = (id: string): string[] => {
    const lines: string[] = [];
    const usedInRecipes = recipes.filter((r) => r.ingredients.some((ri) => ri.ingredientId === id));
    if (usedInRecipes.length > 0) {
      lines.push(`${TEXTS.confirm.usedInRecipes}: ${usedInRecipes.map((r) => r.name).join(', ')}`);
    }
    const usedInDays = days.filter((d) => d.meals.some((m) => m.dishes.some((dish) => dish.ingredientId === id)));
    if (usedInDays.length > 0) {
      lines.push(`${TEXTS.confirm.usedInDays}: ${usedInDays.map((d) => formatDate(d.date)).join(', ')}`);
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
    await deleteIngredient(id);
    setDeletingId(null);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    setConfirmDeleteId(null);
    setDeletingId(confirmDeleteId);
    await deleteIngredient(confirmDeleteId);
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={TEXTS.nav.ingredients}
        search={
          <label className="input input-bordered flex items-center gap-2">
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
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary btn-sm">
          <Plus className="w-4 h-4" />
        </button>
      </PageHeader>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">
          {ingredients.length === 0 ? TEXTS.ingredients.noIngredients : TEXTS.common.noMatches}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className="sticky left-0 z-10">{TEXTS.common.name}</th>
                <th className="text-right whitespace-nowrap">{TEXTS.nutrients.cal}</th>
                <th className="text-right whitespace-nowrap">{TEXTS.nutrients.ch}</th>
                <th className="text-right whitespace-nowrap">{TEXTS.nutrients.fat}</th>
                <th className="text-center whitespace-nowrap">{TEXTS.ingredients.vegetable}</th>
                <th className="text-center whitespace-nowrap">{TEXTS.ingredients.carbLimit}</th>
                <th className="text-right whitespace-nowrap">{TEXTS.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ing) => (
                <IngredientRow
                  key={ing.id}
                  ingredient={ing}
                  onEdit={() => setEditingIngredient(ing)}
                  onDelete={() => handleDelete(ing.id)}
                  deleting={deletingId === ing.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-sm text-base-content/50 text-right">
        {filtered.length} / {ingredients.length}
      </div>

      <dialog ref={dialogRef} className="modal" onClose={closeDialog}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{editingIngredient ? TEXTS.common.update : TEXTS.ingredients.newIngredient}</h3>
          {showAddForm && <IngredientForm onSave={handleAdd} onCancel={closeDialog} />}
          {editingIngredient && (
            <IngredientForm
              initial={editingIngredient}
              onSave={(data) => handleUpdate(editingIngredient.id, data)}
              onCancel={closeDialog}
            />
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

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

function IngredientRow({
  ingredient: ing,
  onEdit,
  onDelete,
  deleting,
}: {
  ingredient: Ingredient;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <tr>
      <td className="font-medium sticky left-0 z-10">{ing.name}</td>
      <td className="text-right tabular-nums whitespace-nowrap">{ing.caloriesPer100}</td>
      <td className="text-right tabular-nums whitespace-nowrap">{ing.carbsPer100}</td>
      <td className="text-right tabular-nums whitespace-nowrap">{ing.fatPer100}</td>
      <td className="text-center whitespace-nowrap">{ing.isVegetable && <Check className="w-4 h-4 inline" />}</td>
      <td className="text-center tabular-nums whitespace-nowrap">
        {ing.carbLimit === null ? <X className="w-4 h-4 inline" /> : ing.carbLimit > 0 ? ing.carbLimit : null}
      </td>
      <td className="text-right whitespace-nowrap">
        <div className="flex justify-end gap-1">
          <button onClick={onEdit} className="btn btn-ghost btn-xs">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} disabled={deleting} className="btn btn-ghost btn-xs text-error">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
