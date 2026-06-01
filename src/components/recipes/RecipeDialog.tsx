import { useState, useMemo, useCallback } from 'react';
import { readIngredients } from '../../services/ingredients';
import { readRecipes, updateRecipe } from '../../services/recipes';
import { calculateRecipeNutrition, buildIngredientMap, recipeToIngredient } from '../../utils/nutrition';
import { round, formatNutrition } from '../../utils/format';
import { TEXTS } from '../../constants/texts';
import RecipeHeaderForm from './RecipeHeaderForm';
import IngredientSelector from '../ingredients/IngredientSelector';
import RecipeIngredients from './RecipeIngredients';
import type { Recipe, RecipeIngredient, RecipeUpdate } from '../../types/recipe';
import type { Ingredient } from '../../types/ingredient';

export default function RecipeDialog({
  recipe,
  onClose,
  onRecipeChange,
  initialEditHeader = false,
  baseRecipeName,
}: {
  recipe: Recipe;
  onClose: () => void;
  onRecipeChange: (recipe: Recipe) => void;
  initialEditHeader?: boolean;
  baseRecipeName?: string;
}) {
  const allIngredients = useMemo(() => readIngredients(), []);
  const allRecipes = useMemo(() => readRecipes(), []);
  const nutritionMap = useMemo(() => buildIngredientMap(allIngredients, allRecipes), [allIngredients, allRecipes]);
  const [focusIngredientId, setFocusIngredientId] = useState<string | null>(null);

  const handleRecipeChange = useCallback(
    (changes: RecipeUpdate) => {
      updateRecipe(recipe.id, changes);
      onRecipeChange({ ...recipe, ...changes });
    },
    [recipe, onRecipeChange],
  );

  const saveIngredients = useCallback(
    async (updated: RecipeIngredient[]) => {
      const nutrition = calculateRecipeNutrition(updated, nutritionMap);
      handleRecipeChange({
        ingredients: updated,
        calories: round(nutrition.calories),
        carbs: round(nutrition.carbs),
        fat: round(nutrition.fat),
      });
    },
    [nutritionMap, handleRecipeChange],
  );

  const nutrition = calculateRecipeNutrition(recipe.ingredients, nutritionMap);
  const available = useMemo(() => {
    const usedIds = new Set(recipe.ingredients.map((ri) => ri.ingredientId));
    const recipeItems = allRecipes
      .filter((rec) => rec.id !== recipe.id && !rec.ingredients.some((ri) => ri.ingredientId === recipe.id))
      .map(recipeToIngredient);
    return [...allIngredients, ...recipeItems].filter((item) => !usedIds.has(item.id));
  }, [allIngredients, allRecipes, recipe.id, recipe.ingredients]);

  const handleAddIngredient = (ingredient: Ingredient) => {
    setFocusIngredientId(ingredient.id);
    saveIngredients([...recipe.ingredients, { ingredientId: ingredient.id, name: ingredient.name, amount: 0 }]);
  };

  const handleHeaderSave = (changes: RecipeUpdate) => {
    handleRecipeChange(changes);
  };

  const subtitle = `${recipe.amount ? `${round(recipe.amount)}g` : '—'} · ${recipe.servings} ${TEXTS.recipes.servings.toLowerCase()} · ${formatNutrition(nutrition)}`;

  return (
    <div className="space-y-4">
      {baseRecipeName && (
        <div className="text-xs text-base-content/50">
          {TEXTS.recipes.basedOn}: {baseRecipeName}
        </div>
      )}
      <RecipeHeaderForm
        name={recipe.name}
        amount={recipe.amount}
        servings={recipe.servings}
        subtitle={subtitle}
        initialEditing={initialEditHeader}
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

      <button onClick={onClose} data-testid="close-button" className="btn btn-ghost btn-sm float-right">
        {TEXTS.common.cancel}
      </button>
    </div>
  );
}
