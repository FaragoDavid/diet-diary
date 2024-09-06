import { addIngredient, updateIngredientAmount, deleteRecipeIngredient } from './recipe-ingredient';
import { fetchRecipe } from './recipe';
import prisma from '../utils/prisma-client';

jest.mock('./recipe');

describe('Recipe Ingredient Repository', () => {
  const TEST_INGREDIENTS = {
    CHICK: { id: 'chick-id', name: 'chick', caloriesPer100: 200, carbsPer100: 0, fatPer100: 10, isVegetable: false, isCarbCounted: true },
    BEEF: { id: 'beef-id', name: 'beef', caloriesPer100: 300, carbsPer100: 0, fatPer100: 20, isVegetable: false, isCarbCounted: true },
    PORK: { id: 'pork-id', name: 'pork', caloriesPer100: 250, carbsPer100: 0, fatPer100: 15, isVegetable: false, isCarbCounted: true },
  };
  const TEST_RECIPES = {
    CHICKEN_CURRY: { id: 'chick-curry-id', name: 'chick curry', amount: null, servings: 1, calories: 0, carbs: 0, fat: 0 },
    BEEF_STEW: { id: 'beef-stew-id', name: 'beef stew', amount: null, servings: 1, calories: 0, carbs: 0, fat: 0 },
    PORK_CHOPS: { id: 'pork-chops-id', name: 'pork chops', amount: null, servings: 1, calories: 0, carbs: 0, fat: 0 },
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
    it('adds an ingredient to a recipe', async () => {
      const amount = 100;
      await addIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, amount);

      const recipeIngredient = await prisma.recipeIngredient.findUnique({
        where: { recipeId_ingredientId: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id } },
      });
      expect(recipeIngredient).toEqual({ amount, ingredientId: TEST_INGREDIENTS.CHICK.id, recipeId: TEST_RECIPES.CHICKEN_CURRY.id });
    });

    it('updates the macro values of the recipe', async () => {
      const amount = 100;
      await prisma.recipe.update({
        where: { id: TEST_RECIPES.CHICKEN_CURRY.id },
        data: { calories: 1000, carbs: 100, fat: 50 },
      });

      await addIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, amount);

      const recipe = await prisma.recipe.findUnique({ where: { id: TEST_RECIPES.CHICKEN_CURRY.id } });
      expect(recipe).toMatchObject({
        calories: 1000 + (TEST_INGREDIENTS.CHICK.caloriesPer100 / 100) * amount,
        carbs: 100 + (TEST_INGREDIENTS.CHICK.carbsPer100 / 100) * amount,
        fat: 50 + (TEST_INGREDIENTS.CHICK.fatPer100 / 100) * amount,
      });
    });

    it('should return the recipe ingredient', async () => {
      const amount = 100;

      const recipeIngredient = await addIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, amount);

      expect(recipeIngredient).toEqual(
        await prisma.recipeIngredient.findUnique({
          where: { recipeId_ingredientId: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id } },
          select: { amount: true, ingredient: true },
        }),
      );
    });

    it('should throw an error if the ingredient does not exist', async () => {
      await expect(addIngredient(TEST_RECIPES.CHICKEN_CURRY.id, 'invalid-id', 100)).rejects.toThrow(
        'Ingredient with id invalid-id does not exist',
      );
    });

    it('should throw an error if the recipe does not exist', async () => {
      await expect(addIngredient('invalid-id', TEST_INGREDIENTS.CHICK.id, 100)).rejects.toThrow('Recipe with id invalid-id does not exist');
    });

    describe('updateIngredientAmount', () => {
      it('should update the amount of an ingredient in a recipe', async () => {
        await prisma.recipeIngredient.create({
          data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 0 },
        });
        const newAmount = 200;

        await updateIngredientAmount(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, newAmount);

        const recipeIngredient = await prisma.recipeIngredient.findUnique({
          where: { recipeId_ingredientId: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id } },
        });
        expect(recipeIngredient?.amount).toEqual(newAmount);
      });

      it('should update the macro values of the recipe', async () => {
        await prisma.recipeIngredient.create({
          data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 100 },
        });
        const newAmount = 200;

        await updateIngredientAmount(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, newAmount);

        const recipe = await prisma.recipe.findUnique({ where: { id: TEST_RECIPES.CHICKEN_CURRY.id } });
        expect(recipe).toMatchObject({
          calories: (TEST_INGREDIENTS.CHICK.caloriesPer100 / 100) * newAmount,
          carbs: (TEST_INGREDIENTS.CHICK.carbsPer100 / 100) * newAmount,
          fat: (TEST_INGREDIENTS.CHICK.fatPer100 / 100) * newAmount,
        });
      });

      it('should return the updated recipe', async () => {
        (fetchRecipe as jest.Mock).mockResolvedValue('mock recipe');
        await prisma.recipeIngredient.create({
          data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 0 },
        });
        const newAmount = 200;

        const updatedRecipe = await updateIngredientAmount(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, newAmount);

        expect(updatedRecipe).toEqual('mock recipe');
      });

      it('should throw an error if the ingredient is not in the recipe', async () => {
        await expect(updateIngredientAmount(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, 100)).rejects.toThrow(
          `Ingredient with id ${TEST_INGREDIENTS.CHICK.id} not found in recipe with id ${TEST_RECIPES.CHICKEN_CURRY.id}`,
        );
      });
    });

    describe('deleteRecipeIngredient', () => {
      it('should delete an ingredient from a recipe', async () => {
        await prisma.recipeIngredient.create({
          data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 100 },
        });

        await deleteRecipeIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id);

        const recipeIngredient = await prisma.recipeIngredient.findUnique({
          where: { recipeId_ingredientId: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id } },
        });
        expect(recipeIngredient).toBeNull;
      });

      it('should update the macro values of the recipe', async () => {
        await prisma.recipeIngredient.create({
          data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 100 },
        });
        await prisma.recipe.update({
          where: { id: TEST_RECIPES.CHICKEN_CURRY.id },
          data: {
            calories: (TEST_INGREDIENTS.CHICK.caloriesPer100 / 100) * 100,
            carbs: (TEST_INGREDIENTS.CHICK.carbsPer100 / 100) * 100,
            fat: (TEST_INGREDIENTS.CHICK.fatPer100 / 100) * 100,
          },
        });

        await deleteRecipeIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id);

        const recipe = await prisma.recipe.findUnique({ where: { id: TEST_RECIPES.CHICKEN_CURRY.id } });
        expect(recipe).toMatchObject({
          calories: 0,
          carbs: 0,
          fat: 0,
        });
      });

      it('should return the updated recipe', async () => {
        (fetchRecipe as jest.Mock).mockResolvedValue('mock recipe');
        await prisma.recipeIngredient.create({
          data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 100 },
        });

        const updatedRecipe = await deleteRecipeIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id);

        expect(updatedRecipe).toEqual('mock recipe');
      });

      it('should throw an error if the ingredient is not in the recipe', async () => {
        await expect(deleteRecipeIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id)).rejects.toThrow(
          `Ingredient with id ${TEST_INGREDIENTS.CHICK.id} not found in recipe with id ${TEST_RECIPES.CHICKEN_CURRY.id}`,
        );
      });
    });
  });
});
