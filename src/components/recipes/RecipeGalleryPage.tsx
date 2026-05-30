import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, UtensilsCrossed } from 'lucide-react';
import { useRecipes, createRecipe } from '../../services/recipes';
import { useDebounce } from '../../hooks/useDebounce';
import { formatNutrition } from '../../utils/format';
import { TEXTS } from '../../constants/texts';
import PageHeader from '../PageHeader';
import type { Recipe } from '../../types/recipe';

function RecipeTile({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
      <figure className="aspect-[4/3] bg-base-200 relative">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-base-content/20">
            <UtensilsCrossed className="w-12 h-12" />
          </div>
        )}
      </figure>
      <div className="card-body p-3">
        <h3 className="card-title text-sm">{recipe.name || TEXTS.recipes.newPlaceholder}</h3>
        <p className="text-xs text-base-content/60">
          {formatNutrition({ calories: recipe.calories, carbs: recipe.carbs, fat: recipe.fat })}
        </p>
      </div>
    </button>
  );
}

export default function RecipeGalleryPage() {
  const { recipes } = useRecipes();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 200);

  const baseRecipes = useMemo(() => recipes.filter((recipe) => !recipe.baseRecipeId), [recipes]);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return baseRecipes;
    const query = debouncedQuery.toLowerCase();
    return baseRecipes.filter((recipe) => recipe.name.toLowerCase().includes(query));
  }, [baseRecipes, debouncedQuery]);

  const handleCreate = async () => {
    const id = await createRecipe('');
    navigate(`/gallery/${id}`);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <PageHeader
        title={TEXTS.nav.gallery}
        search={
          <label className="input input-bordered input-sm flex items-center gap-2">
            <Search className="w-4 h-4 opacity-50" />
            <input
              type="text"
              placeholder={TEXTS.recipes.search}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((recipe) => (
              <RecipeTile key={recipe.id} recipe={recipe} onClick={() => navigate(`/gallery/${recipe.id}`)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
