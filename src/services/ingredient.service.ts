import * as ingredientRepository from '../repository/ingredient';
import * as recipeRepository from '../repository/recipe';

export async function removeIngredient(id: string, query?: string) {
  const recipes = await recipeRepository.fetchRecipes();
  const recipesUsingIngredient = recipes.filter((recipe) => recipe.ingredients.some((ri) => ri.ingredient.id === id));

  if (recipesUsingIngredient.length > 0) {
    const recipeNames = recipesUsingIngredient.map((r) => r.name).join(', ');
    throw new Error(`Cannot delete ingredient. It is used in ${recipesUsingIngredient.length} recipe(s): ${recipeNames}`);
  }

  await ingredientRepository.deleteIngredient(id);

  let ingredients = await ingredientRepository.fetchIngredients(query);
  if (ingredients.length === 0) {
    ingredients = await ingredientRepository.fetchIngredients();
  }

  return ingredients;
}
