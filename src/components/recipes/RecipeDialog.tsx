import { useState, useMemo, useCallback } from 'react';
import { updateRecipe } from '../../services/recipes';
import { calculateRecipeNutrition, round, formatNutrition, buildNutritionMap, recipeToIngredient } from '../../utils/nutrition';
import { TEXTS } from '../../constants/texts';
import RecipeHeaderForm from './RecipeHeaderForm';
import IngredientSelector from '../ingredients/IngredientSelector';
import RecipeIngredients from './RecipeIngredients';
import type { Recipe, RecipeIngredient } from '../../types/recipe';
import type { Ingredient } from '../../types/ingredient';

export default function RecipeDialog({
  recipe,
  ingredients,
  recipes,
  onClose,
  initialEditHeader = false,
  baseRecipeName,
}: {
  recipe: Recipe;
  ingredients: Ingredient[];
  recipes: Recipe[];
  onClose: () => void;
  initialEditHeader?: boolean;
  baseRecipeName?: string;
}) {
  const nutritionMap = useMemo(() => buildNutritionMap(ingredients, recipes), [ingredients, recipes]);
  const [focusIngredientId, setFocusIngredientId] = useState<string | null>(null);

  const saveIngredients = useCallback(
    async (updated: RecipeIngredient[]) => {
      const nutrition = calculateRecipeNutrition(updated, nutritionMap);
      await updateRecipe(recipe.id, {
        ingredients: updated,
        calories: round(nutrition.calories),
        carbs: round(nutrition.carbs),
        fat: round(nutrition.fat),
      });
    },
    [recipe.id, nutritionMap],
  );

  const nutrition = calculateRecipeNutrition(recipe.ingredients, nutritionMap);
  const available = useMemo(() => {
    const usedIds = new Set(recipe.ingredients.map((ri) => ri.ingredientId));
    const recipeItems = recipes
      .filter((r) => r.id !== recipe.id && !r.ingredients.some((ri) => ri.ingredientId === recipe.id))
      .map(recipeToIngredient);
    return [...ingredients, ...recipeItems].filter((i) => !usedIds.has(i.id));
  }, [ingredients, recipes, recipe.id, recipe.ingredients]);

  const handleAddIngredient = async (ingredient: Ingredient) => {
    setFocusIngredientId(ingredient.id);
    await saveIngredients([...recipe.ingredients, { ingredientId: ingredient.id, name: ingredient.name, amount: 0 }]);
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
        recipeId={recipe.id}
        name={recipe.name}
        amount={recipe.amount}
        servings={recipe.servings}
        subtitle={subtitle}
        initialEditing={initialEditHeader}
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

      <button onClick={onClose} className="btn btn-ghost btn-sm float-right">
        {TEXTS.common.cancel}
      </button>
    </div>
  );
}
