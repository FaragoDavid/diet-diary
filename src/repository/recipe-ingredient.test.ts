import { addIngredient, updateIngredientAmount, deleteRecipeIngredient } from './recipe-ingredient';
import prisma from '../utils/prisma-client';

describe('Recipe Ingredient Repository', () => {
  const TEST_INGREDIENTS = {
    CHICK: { id: 'chick-id', name: 'chick', caloriesPer100: 200, carbsPer100: 0, fatPer100: 10, isVegetable: false, isCarbCounted: true },
    BEEF: { id: 'beef-id', name: 'beef', caloriesPer100: 300, carbsPer100: 0, fatPer100: 20, isVegetable: false, isCarbCounted: true },
    PORK: { id: 'pork-id', name: 'pork', caloriesPer100: 250, carbsPer100: 0, fatPer100: 15, isVegetable: false, isCarbCounted: true },
  };
  const TEST_RECIPES = {
    CHICKEN_CURRY: { id: 'chick-curry-id', name: 'chick curry', amount: null, servings: null },
    BEEF_STEW: { id: 'beef-stew-id', name: 'beef stew', amount: null, servings: null },
    PORK_CHOPS: { id: 'pork-chops-id', name: 'pork chops', amount: null, servings: null },
  };

  beforeEach(async () => {
    await prisma.ingredient.createMany({
      data: [TEST_INGREDIENTS.CHICK, TEST_INGREDIENTS.BEEF, TEST_INGREDIENTS.PORK],
    });
    await prisma.recipe.createMany({
      data: [TEST_RECIPES.CHICKEN_CURRY, TEST_RECIPES.BEEF_STEW, TEST_RECIPES.PORK_CHOPS],
    });
  });

  describe('addIngredient', () => {
    it('should add an ingredient to a recipe', async () => {
      const amount = 100;
      const recipeIngredient = await addIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, amount);

      expect(recipeIngredient).toEqual({
        amount,
        ingredient: TEST_INGREDIENTS.CHICK,
      });
    });
  });

  describe('updateIngredientAmount', () => {
    it('should update the amount of an ingredient in a recipe', async () => {
      await prisma.recipeIngredient.create({
        data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 100 },
      });
      const newAmount = 200;

      const updatedRecipe = await updateIngredientAmount(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, newAmount);

      expect(updatedRecipe).toEqual({
        ...TEST_RECIPES.CHICKEN_CURRY,
        ingredients: [{ amount: newAmount, ingredient: TEST_INGREDIENTS.CHICK }],
      });
    });
  });

  describe('deleteRecipeIngredient', () => {
    it('should delete an ingredient from a recipe', async () => {
      await prisma.recipeIngredient.create({
        data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 100 },
      });
      const updatedRecipe = await deleteRecipeIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id);
      
      expect(updatedRecipe).toEqual({
        ...TEST_RECIPES.CHICKEN_CURRY,
        ingredients: [],
      });
    });
  });
});
