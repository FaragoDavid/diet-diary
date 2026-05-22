import { useState, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2, Leaf, Package } from 'lucide-react';
import { useIngredients, createIngredient, updateIngredient, deleteIngredient } from '../services/ingredients';
import { useDebounce } from '../hooks/useDebounce';
import IngredientForm from './IngredientForm';
import type { Ingredient, NewIngredient } from '../types/ingredient';

export default function IngredientsPage({ uid }: { uid: string }) {
  const { ingredients, loading, error } = useIngredients(uid);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 200);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = ingredients;
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q));
    }
    if (showInStockOnly) {
      result = result.filter((i) => i.inStock);
    }
    return result;
  }, [ingredients, debouncedQuery, showInStockOnly]);

  const handleAdd = async (data: NewIngredient) => {
    await createIngredient(uid, data);
    setShowAddForm(false);
  };

  const handleUpdate = async (id: string, data: NewIngredient) => {
    await updateIngredient(uid, id, data);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteIngredient(uid, id);
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
        <span>Failed to load ingredients: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ingredients</h2>
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary btn-sm">
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="form-control flex-1 min-w-48">
          <label className="input input-bordered flex items-center gap-2">
            <Search className="w-4 h-4 opacity-50" />
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="grow"
            />
          </label>
        </div>
        <label className="label cursor-pointer gap-2">
          <input
            type="checkbox"
            checked={showInStockOnly}
            onChange={(e) => setShowInStockOnly(e.target.checked)}
            className="toggle toggle-sm"
          />
          <span className="label-text">In stock only</span>
        </label>
      </div>

      {showAddForm && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-lg">New Ingredient</h3>
            <IngredientForm onSave={handleAdd} onCancel={() => setShowAddForm(false)} />
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">
          {ingredients.length === 0 ? 'No ingredients yet. Add your first one!' : 'No matches.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Name</th>
                <th className="text-right">Cal</th>
                <th className="text-right">Carbs</th>
                <th className="text-right">Fat</th>
                <th className="text-center">Tags</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ing) =>
                editingId === ing.id ? (
                  <tr key={ing.id}>
                    <td colSpan={6}>
                      <IngredientForm initial={ing} onSave={(data) => handleUpdate(ing.id, data)} onCancel={() => setEditingId(null)} />
                    </td>
                  </tr>
                ) : (
                  <IngredientRow
                    key={ing.id}
                    ingredient={ing}
                    onEdit={() => setEditingId(ing.id)}
                    onDelete={() => handleDelete(ing.id)}
                    deleting={deletingId === ing.id}
                  />
                ),
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-sm text-base-content/50 text-right">
        {filtered.length} of {ingredients.length} ingredients
      </div>
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
      <td className="font-medium">{ing.name}</td>
      <td className="text-right tabular-nums">{ing.caloriesPer100}</td>
      <td className="text-right tabular-nums">{ing.carbsPer100}</td>
      <td className="text-right tabular-nums">{ing.fatPer100}</td>
      <td className="text-center space-x-1">
        {ing.isVegetable && (
          <span className="badge badge-sm badge-success gap-1">
            <Leaf className="w-3 h-3" /> Veg
          </span>
        )}
        {ing.inStock && (
          <span className="badge badge-sm badge-info gap-1">
            <Package className="w-3 h-3" /> Stock
          </span>
        )}
        {!ing.isCarbCounted && <span className="badge badge-sm badge-warning">No carb</span>}
      </td>
      <td className="text-right">
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
