import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Trash2 } from 'lucide-react';
import { useRecipes, createRecipe, deleteRecipe } from '../services/recipes';
import { useDebounce } from '../hooks/useDebounce';
import { round } from '../utils/nutrition';
import type { Recipe } from '../types/recipe';

export default function RecipesPage({ uid }: { uid: string }) {
  const { recipes, loading, error } = useRecipes(uid);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 200);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return recipes;
    const q = debouncedQuery.toLowerCase();
    return recipes.filter((r) => r.name.toLowerCase().includes(q));
  }, [recipes, debouncedQuery]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      await createRecipe(uid, name);
      setNewName('');
    } finally {
      setCreating(false);
    }
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
        <span>Failed to load recipes: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recipes</h2>

      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New recipe name..."
          className="input input-bordered flex-1"
        />
        <button type="submit" disabled={creating || !newName.trim()} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      <div className="form-control">
        <label className="input input-bordered flex items-center gap-2">
          <Search className="w-4 h-4 opacity-50" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="grow"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-base-content/50">
          {recipes.length === 0 ? 'No recipes yet. Create your first one!' : 'No matches.'}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onDelete={() => handleDelete(recipe.id)} deleting={deletingId === recipe.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecipeCard({ recipe, onDelete, deleting }: { recipe: Recipe; onDelete: () => void; deleting: boolean }) {
  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4 flex-row items-center justify-between">
        <div>
          <Link to={`/recipes/${recipe.id}`} className="card-title text-base link link-hover">
            {recipe.name}
          </Link>
          <div className="text-sm text-base-content/60 mt-1">
            {round(recipe.calories)} cal · {round(recipe.carbs)}g carbs · {round(recipe.fat)}g fat
            {recipe.amount != null && <span> · {recipe.amount}g</span>}
            {recipe.ingredients.length > 0 && <span> · {recipe.ingredients.length} ingredients</span>}
          </div>
        </div>
        <button onClick={onDelete} disabled={deleting} className="btn btn-ghost btn-sm text-error">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
