import { Ingredient } from '@prisma/client';
import * as ingredientRepository from '../repository/ingredient';
import * as recipeRepository from '../repository/recipe';
import * as recipeIngredientRepository from '../repository/recipe-ingredient';

function calculateNutrition(ingredient: Ingredient, amount: number) {
  return {
    calories: (ingredient.caloriesPer100 / 100) * amount,
    carbs: (ingredient.carbsPer100 / 100) * amount,
    fat: (ingredient.fatPer100 / 100) * amount,
  };
}

export async function addIngredientToRecipe(recipeId: string, ingredientId: string, amount: number) {
  const ingredient = await ingredientRepository.fetchIngredient(ingredientId);

  if (!ingredient) {
    throw new Error('Ingredient not found');
  }

  const { amount: ingredientAmount, ingredient: addedIngredient } = await recipeIngredientRepository.addIngredient(
    recipeId,
    ingredientId,
    amount,
    calculateNutrition(ingredient, amount),
  );

  const recipe = await recipeRepository.fetchRecipe(recipeId);

  if (!recipe) {
    throw new Error('Recipe not found after adding ingredient');
  }

  return { ingredientAmount, ingredient: addedIngredient, recipe };
}

export async function updateRecipeIngredientAmount(recipeId: string, ingredientId: string, amount: number) {
  const recipe = await recipeRepository.fetchRecipe(recipeId);

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  const recipeIngredient = recipe.ingredients.find(({ ingredient }) => ingredient.id === ingredientId);

  if (!recipeIngredient) {
    throw new Error('Ingredient not found in recipe');
  }

  const oldAmount = recipeIngredient.amount;
  const ingredient = recipeIngredient.ingredient;

  const oldNutrition = calculateNutrition(ingredient, oldAmount);
  const newNutrition = calculateNutrition(ingredient, amount);

  const updatedRecipe = await recipeIngredientRepository.updateIngredientAmount(recipeId, ingredientId, amount, {
    calories: newNutrition.calories - oldNutrition.calories,
    carbs: newNutrition.carbs - oldNutrition.carbs,
    fat: newNutrition.fat - oldNutrition.fat,
  });

  if (!updatedRecipe) {
    throw new Error('Recipe not found');
  }

  return updatedRecipe;
}

export async function removeIngredientFromRecipe(recipeId: string, ingredientId: string) {
  const recipe = await recipeRepository.fetchRecipe(recipeId);

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  const recipeIngredient = recipe.ingredients.find((ri) => ri.ingredient.id === ingredientId);

  if (!recipeIngredient) {
    throw new Error('Ingredient not found in recipe');
  }

  const ingredient = recipeIngredient.ingredient;
  const amount = recipeIngredient.amount;

  const updatedRecipe = await recipeIngredientRepository.deleteRecipeIngredient(
    recipeId,
    ingredientId,
    calculateNutrition(ingredient, -amount),
  );

  if (!updatedRecipe) {
    throw new Error('Recipe not found');
  }

  return updatedRecipe;
}

export async function removeRecipe(recipeId: string, query?: string) {
  await recipeRepository.deleteRecipe(recipeId);

  let recipes = await recipeRepository.fetchRecipes(query);
  if (recipes.length === 0) {
    recipes = await recipeRepository.fetchRecipes('');
  }

  return recipes;
}
