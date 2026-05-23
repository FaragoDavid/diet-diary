import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Search, Plus, Trash2, Pencil } from 'lucide-react';
import { useRecipes, createRecipe, updateRecipe, deleteRecipe } from '../services/recipes';
import { useIngredients } from '../services/ingredients';
import { useDebounce } from '../hooks/useDebounce';
import IngredientAutocomplete from './IngredientAutocomplete';
import { calculateRecipeNutrition, calculateIngredientNutrition, round } from '../utils/nutrition';
import { TEXTS } from '../constants/texts';
import type { Recipe, RecipeIngredient } from '../types/recipe';
import type { Ingredient } from '../types/ingredient';

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
        <div className="modal-box max-w-2xl">
          {selectedRecipe && (
            <RecipeDetailDialog
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

function RecipeDetailDialog({
  uid,
  recipe,
  ingredients,
  onClose,
  initialEditHeader = false,
}: {
  uid: string;
  recipe: Recipe;
  ingredients: Ingredient[];
  onClose: () => void;
  initialEditHeader?: boolean;
}) {
  const ingredientsMap = useMemo(() => new Map(ingredients.map((i) => [i.id, i])), [ingredients]);
  const [editingHeader, setEditingHeader] = useState(initialEditHeader);
  const [focusIngredientId, setFocusIngredientId] = useState<string | null>(null);

  const saveIngredients = useCallback(
    async (updated: RecipeIngredient[]) => {
      const nutrition = calculateRecipeNutrition(updated, ingredientsMap);
      await updateRecipe(uid, recipe.id, {
        ingredients: updated,
        calories: round(nutrition.calories),
        carbs: round(nutrition.carbs),
        fat: round(nutrition.fat),
      });
    },
    [uid, recipe.id, ingredientsMap],
  );

  const nutrition = calculateRecipeNutrition(recipe.ingredients, ingredientsMap);
  const availableIngredients = ingredients.filter((i) => !recipe.ingredients.some((ri) => ri.ingredientId === i.id));

  return (
    <div className="space-y-4">
      {editingHeader ? (
        <RecipeHeaderForm
          uid={uid}
          recipeId={recipe.id}
          name={recipe.name}
          amount={recipe.amount}
          servings={recipe.servings}
          onClose={() => setEditingHeader(false)}
        />
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{recipe.name}</h3>
            <div className="text-sm text-base-content/70">
              {recipe.amount ? `${recipe.amount}g` : '—'} · {recipe.servings} {TEXTS.recipes.servings.toLowerCase()} · {TEXTS.nutrients.cal}
              : {round(nutrition.calories)} · {TEXTS.nutrients.ch}: {round(nutrition.carbs)}g · {TEXTS.nutrients.fat}:{' '}
              {round(nutrition.fat)}g
            </div>
          </div>
          <button onClick={() => setEditingHeader(true)} className="btn btn-ghost btn-xs">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-semibold">{TEXTS.recipes.ingredients}</h4>
        <AddIngredientRow
          recipeIngredients={recipe.ingredients}
          available={availableIngredients}
          onSave={saveIngredients}
          onAdded={setFocusIngredientId}
        />
        {recipe.ingredients.length === 0 ? (
          <p className="text-base-content/50 py-4 text-center">{TEXTS.recipes.noIngredients}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm">
              <thead>
                <tr>
                  <th>{TEXTS.recipes.ingredient}</th>
                  <th className="text-right">{TEXTS.recipes.amountG}</th>
                  <th className="text-right">{TEXTS.nutrients.cal}</th>
                  <th className="text-right">{TEXTS.nutrients.ch}</th>
                  <th className="text-right">{TEXTS.nutrients.fat}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients.map((ri) => (
                  <RecipeIngredientRow
                    key={ri.ingredientId}
                    ri={ri}
                    ingredient={ingredientsMap.get(ri.ingredientId)}
                    allIngredients={recipe.ingredients}
                    onSave={saveIngredients}
                    autoFocus={focusIngredientId === ri.ingredientId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button onClick={onClose} className="btn btn-ghost btn-sm">
          {TEXTS.common.cancel}
        </button>
      </div>
    </div>
  );
}

function RecipeHeaderForm({
  uid,
  recipeId,
  name,
  amount,
  servings,
  onClose,
}: {
  uid: string;
  recipeId: string;
  name: string;
  amount: number | null;
  servings: number;
  onClose: () => void;
}) {
  const [editName, setEditName] = useState(name);
  const [editAmount, setEditAmount] = useState(amount?.toString() ?? '');
  const [editServings, setEditServings] = useState(servings.toString());
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editName.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await updateRecipe(uid, recipeId, {
        name: trimmed,
        amount: editAmount ? parseFloat(editAmount) : null,
        servings: parseInt(editServings) || 1,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <table className="table">
        <tbody>
          <tr>
            <td className="font-medium">{TEXTS.common.name}</td>
            <td>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input input-bordered input-sm w-full"
                required
                autoFocus
              />
            </td>
          </tr>
          <tr>
            <td className="font-medium">{TEXTS.recipes.amountG}</td>
            <td>
              <input
                type="number"
                min="0"
                step="1"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                placeholder="—"
                className="input input-bordered input-sm w-full"
              />
            </td>
          </tr>
          <tr>
            <td className="font-medium">{TEXTS.recipes.servings}</td>
            <td>
              <input
                type="number"
                min="1"
                step="1"
                value={editServings}
                onChange={(e) => setEditServings(e.target.value)}
                className="input input-bordered input-sm w-full"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">
          {TEXTS.common.cancel}
        </button>
        <button type="submit" disabled={saving || !editName.trim()} className="btn btn-primary btn-sm">
          {saving ? TEXTS.common.saving : TEXTS.common.save}
        </button>
      </div>
    </form>
  );
}

function AddIngredientRow({
  recipeIngredients,
  available,
  onSave,
  onAdded,
}: {
  recipeIngredients: RecipeIngredient[];
  available: Ingredient[];
  onSave: (ingredients: RecipeIngredient[]) => Promise<void>;
  onAdded: (ingredientId: string) => void;
}) {
  const [saving, setSaving] = useState(false);

  const handleSelect = async (ingredient: Ingredient) => {
    setSaving(true);
    try {
      onAdded(ingredient.id);
      await onSave([...recipeIngredients, { ingredientId: ingredient.id, name: ingredient.name, amount: 0 }]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="flex-1">
        <IngredientAutocomplete ingredients={available} onSelect={handleSelect} placeholder={TEXTS.recipes.addIngredient} />
      </div>
      {saving && <span className="loading loading-spinner loading-sm"></span>}
    </div>
  );
}

function RecipeIngredientRow({
  ri,
  ingredient,
  allIngredients,
  onSave,
  autoFocus,
}: {
  ri: RecipeIngredient;
  ingredient: Ingredient | undefined;
  allIngredients: RecipeIngredient[];
  onSave: (ingredients: RecipeIngredient[]) => Promise<void>;
  autoFocus?: boolean;
}) {
  const [editAmount, setEditAmount] = useState(ri.amount ? ri.amount.toString() : '');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 0);
  }, [autoFocus]);

  const nutrition = ingredient ? calculateIngredientNutrition(ingredient, ri.amount) : { calories: 0, carbs: 0, fat: 0 };

  const handleBlur = async () => {
    const newAmount = parseFloat(editAmount);
    if (!newAmount || newAmount <= 0 || newAmount === ri.amount) return;
    setSaving(true);
    try {
      await onSave(allIngredients.map((i) => (i.ingredientId === ri.ingredientId ? { ...i, amount: newAmount } : i)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await onSave(allIngredients.filter((i) => i.ingredientId !== ri.ingredientId));
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr>
      <td className="font-medium">{ri.name}</td>
      <td className="text-right">
        <input
          ref={inputRef}
          data-ingredient-id={ri.ingredientId}
          type="number"
          min="0"
          step="1"
          value={editAmount}
          onChange={(e) => setEditAmount(e.target.value)}
          onBlur={handleBlur}
          className="input input-bordered input-xs w-20 text-right"
        />
      </td>
      <td className="text-right tabular-nums">{round(nutrition.calories)}</td>
      <td className="text-right tabular-nums">{round(nutrition.carbs)}</td>
      <td className="text-right tabular-nums">{round(nutrition.fat)}</td>
      <td>
        <button onClick={handleDelete} disabled={saving} className="btn btn-ghost btn-xs text-error">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
}
