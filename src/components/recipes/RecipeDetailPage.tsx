import { useState, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ImageIcon, Trash2, UtensilsCrossed } from 'lucide-react';
import { readRecipes, updateRecipe, deleteRecipe } from '../../services/recipes';
import { readIngredients } from '../../services/ingredients';
import { readDays } from '../../services/days';
import { calculateRecipeNutrition, buildIngredientMap, recipeToIngredient } from '../../utils/nutrition';
import { round, formatNutrition, formatDate } from '../../utils/format';
import { TEXTS } from '../../constants/texts';
import RecipeHeaderForm from './RecipeHeaderForm';
import IngredientSelector from '../ingredients/IngredientSelector';
import RecipeIngredients from './RecipeIngredients';
import ImagePickerDialog from './ImagePickerDialog';
import ConfirmDialog from '../ConfirmDialog';
import PageHeader from '../PageHeader';
import type { Recipe, RecipeIngredient, RecipeUpdate } from '../../types/recipe';
import type { Ingredient } from '../../types/ingredient';

export default function RecipeDetailPage() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const allRecipes = useMemo(() => readRecipes(), []);
  const allIngredients = useMemo(() => readIngredients(), []);
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(() => allRecipes.find((rec) => rec.id === recipeId) ?? null);
  const [focusIngredientId, setFocusIngredientId] = useState<string | null>(null);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const nutritionMap = useMemo(() => buildIngredientMap(allIngredients, allRecipes), [allIngredients, allRecipes]);

  const handleRecipeChange = useCallback(
    (changes: RecipeUpdate) => {
      updateRecipe(recipe!.id, changes);
      setRecipe((prev) => (prev ? { ...prev, ...changes } : prev));
    },
    [recipe],
  );

  const saveIngredients = useCallback(
    async (updated: RecipeIngredient[]) => {
      if (!recipe) return;
      const nutrition = calculateRecipeNutrition(updated, nutritionMap);
      handleRecipeChange({
        ingredients: updated,
        calories: round(nutrition.calories),
        carbs: round(nutrition.carbs),
        fat: round(nutrition.fat),
      });
    },
    [recipe, nutritionMap, handleRecipeChange],
  );

  const available = useMemo(() => {
    if (!recipe) return [];
    const usedIds = new Set(recipe.ingredients.map((ri) => ri.ingredientId));
    const recipeItems = allRecipes
      .filter((rec) => rec.id !== recipe.id && !rec.ingredients.some((ri) => ri.ingredientId === recipe.id))
      .map(recipeToIngredient);
    return [...allIngredients, ...recipeItems].filter((item) => !usedIds.has(item.id));
  }, [allIngredients, allRecipes, recipe]);

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/50 mb-4">{TEXTS.recipes.notFound}</p>
        <Link to="/gallery" className="btn btn-ghost btn-sm">
          <ArrowLeft className="w-4 h-4" /> {TEXTS.recipes.backToRecipes}
        </Link>
      </div>
    );
  }

  const handleAddIngredient = (ingredient: Ingredient) => {
    setFocusIngredientId(ingredient.id);
    saveIngredients([...recipe.ingredients, { ingredientId: ingredient.id, name: ingredient.name, amount: 0 }]);
  };

  const handleSelectImage = (imageUrl: string) => {
    handleRecipeChange({ imageUrl });
    setImagePickerOpen(false);
  };

  const handleHeaderSave = (changes: RecipeUpdate) => {
    handleRecipeChange(changes);
  };

  const getUsageLines = (): string[] => {
    const days = readDays();
    const usedInDays = days.filter((day) => day.meals.some((meal) => meal.dishes.some((dish) => dish.recipeId === recipe.id)));
    if (usedInDays.length > 0) {
      return [`${TEXTS.confirm.usedInDays}: ${usedInDays.map((day) => formatDate(day.date)).join(', ')}`];
    }
    return [];
  };

  const handleDelete = () => {
    const lines = getUsageLines();
    if (lines.length > 0) {
      setConfirmDeleteOpen(true);
      return;
    }
    performDelete();
  };

  const performDelete = async () => {
    setDeleting(true);
    await deleteRecipe(recipe.id);
    navigate('/gallery');
  };

  const handleConfirmDelete = async () => {
    setConfirmDeleteOpen(false);
    await performDelete();
  };

  const nutrition = calculateRecipeNutrition(recipe.ingredients, nutritionMap);
  const baseRecipe = recipe.baseRecipeId ? allRecipes.find((rec) => rec.id === recipe.baseRecipeId) : null;
  const subtitle = `${recipe.amount ? `${round(recipe.amount)}g` : '—'} · ${recipe.servings} ${TEXTS.recipes.servings.toLowerCase()} · ${formatNutrition(nutrition)}`;

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <PageHeader>
        <Link to="/gallery" className="btn btn-ghost btn-sm">
          <ArrowLeft className="w-4 h-4" /> {TEXTS.recipes.backToRecipes}
        </Link>
        <div className="flex-1" />
        <button onClick={handleDelete} disabled={deleting} className="btn btn-ghost btn-sm text-error">
          <Trash2 className="w-4 h-4" />
        </button>
      </PageHeader>

      <div className="flex-1 overflow-auto space-y-4">
        <div className="relative aspect-video max-h-64 bg-base-100 rounded-lg overflow-hidden">
          {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-base-content/20">
              <UtensilsCrossed className="w-16 h-16" />
            </div>
          )}
          <button
            onClick={() => setImagePickerOpen(true)}
            className="btn btn-sm btn-ghost absolute bottom-2 right-2 bg-base-100/80 backdrop-blur-sm"
          >
            <ImageIcon className="w-4 h-4" />
            {TEXTS.recipeGallery.changeImage}
          </button>
        </div>

        {baseRecipe && (
          <div className="text-xs text-base-content/50">
            {TEXTS.recipes.basedOn}: {baseRecipe.name}
          </div>
        )}

        <RecipeHeaderForm
          name={recipe.name}
          amount={recipe.amount}
          servings={recipe.servings}
          subtitle={subtitle}
          onSave={handleHeaderSave}
        />

        <div className="space-y-3">
          <h4 className="font-semibold">{TEXTS.recipes.ingredients}</h4>
          <IngredientSelector ingredients={available} onSelect={handleAddIngredient} placeholder={TEXTS.recipes.addIngredient} />
          <RecipeIngredients
            ingredients={recipe.ingredients}
            nutritionMap={nutritionMap}
            onSave={saveIngredients}
            focusIngredientId={focusIngredientId}
          />
        </div>
      </div>

      <ImagePickerDialog open={imagePickerOpen} onSelect={handleSelectImage} onClose={() => setImagePickerOpen(false)} />

      <ConfirmDialog
        open={confirmDeleteOpen}
        title={TEXTS.confirm.deleteRecipe}
        lines={getUsageLines()}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmDeleteOpen(false)}
      />
    </div>
  );
}
