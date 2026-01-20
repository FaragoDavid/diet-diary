import { Ingredient } from '@prisma/client';
import * as ingredientRepository from '../repository/ingredient';
import * as recipeRepository from '../repository/recipe';
import * as recipeIngredientRepository from '../repository/recipe-ingredient';

export class RecipeService {
  async getAllRecipesWithIngredients(query?: string) {
    const [recipes, ingredients] = await Promise.all([recipeRepository.fetchRecipes(query), ingredientRepository.fetchIngredients()]);

    return { recipes, ingredients };
  }

  async getRecipeWithIngredients(id: string) {
    const [recipe, ingredients] = await Promise.all([recipeRepository.fetchRecipe(id), ingredientRepository.fetchIngredients()]);

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    return { recipe, ingredients };
  }

  async createNewRecipe(name: string) {
    const [recipe, ingredients] = await Promise.all([recipeRepository.createRecipe(name), ingredientRepository.fetchIngredients()]);

    return { recipe, ingredients };
  }

  async addIngredientToRecipe(recipeId: string, ingredientId: string, amount: number) {
    const { amount: ingredientAmount, ingredient } = await recipeIngredientRepository.addIngredient(recipeId, ingredientId, amount);

    const [ingredients, recipe] = await Promise.all([ingredientRepository.fetchIngredients(), recipeRepository.fetchRecipe(recipeId)]);

    if (!recipe) {
      throw new Error('Recipe not found after adding ingredient');
    }

    return { ingredientAmount, ingredient, ingredients, recipe };
  }

  async updateRecipeIngredientAmount(recipeId: string, ingredientId: string, amount: number) {
    const recipe = await recipeIngredientRepository.updateIngredientAmount(recipeId, ingredientId, amount);

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    return recipe;
  }

  async removeIngredientFromRecipe(recipeId: string, ingredientId: string) {
    const recipe = await recipeIngredientRepository.deleteRecipeIngredient(recipeId, ingredientId);

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    const recipeIngredientIds = recipe.ingredients.map(({ ingredient }) => ingredient.id);
    const ingredients = await ingredientRepository.fetchIngredients();

    return { recipe, recipeIngredientIds, ingredients };
  }

  async updateRecipeServingAmount(recipeId: string, amount: number) {
    return recipeRepository.updateRecipeAmount(recipeId, amount);
  }

  async removeRecipe(recipeId: string, query?: string) {
    await recipeRepository.deleteRecipe(recipeId);

    let recipes = await recipeRepository.fetchRecipes(query);
    if (recipes.length === 0) {
      recipes = await recipeRepository.fetchRecipes('');
    }

    const ingredients = await ingredientRepository.fetchIngredients();

    return { recipes, ingredients };
  }
}

export const recipeService = new RecipeService();
