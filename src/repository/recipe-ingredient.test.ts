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
      const nutritionDelta = { calories: 200, carbs: 0, fat: 10 };
      await addIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, amount, nutritionDelta);

      const recipeIngredient = await prisma.recipeIngredient.findUnique({
        where: { recipeId_ingredientId: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id } },
      });
      expect(recipeIngredient).toEqual({ amount, ingredientId: TEST_INGREDIENTS.CHICK.id, recipeId: TEST_RECIPES.CHICKEN_CURRY.id });
    });

    it('updates the macro values of the recipe by the provided nutrition delta', async () => {
      const amount = 100;
      const nutritionDelta = { calories: 200, carbs: 50, fat: 10 };
      await prisma.recipe.update({
        where: { id: TEST_RECIPES.CHICKEN_CURRY.id },
        data: { calories: 1000, carbs: 100, fat: 50 },
      });

      await addIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, amount, nutritionDelta);

      const recipe = await prisma.recipe.findUnique({ where: { id: TEST_RECIPES.CHICKEN_CURRY.id } });
      expect(recipe).toMatchObject({
        calories: 1000 + nutritionDelta.calories,
        carbs: 100 + nutritionDelta.carbs,
        fat: 50 + nutritionDelta.fat,
      });
    });

    it('should return the recipe ingredient', async () => {
      const amount = 100;
      const nutritionDelta = { calories: 200, carbs: 0, fat: 10 };

      const recipeIngredient = await addIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, amount, nutritionDelta);

      expect(recipeIngredient).toEqual(
        await prisma.recipeIngredient.findUnique({
          where: { recipeId_ingredientId: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id } },
          select: { amount: true, ingredient: true },
        }),
      );
    });

    it('should throw an error if the ingredient does not exist', async () => {
      const nutritionDelta = { calories: 200, carbs: 0, fat: 10 };
      await expect(addIngredient(TEST_RECIPES.CHICKEN_CURRY.id, 'invalid-id', 100, nutritionDelta)).rejects.toThrow(
        'Ingredient with id invalid-id does not exist',
      );
    });

    it('should throw an error if the recipe does not exist', async () => {
      const nutritionDelta = { calories: 200, carbs: 0, fat: 10 };
      await expect(addIngredient('invalid-id', TEST_INGREDIENTS.CHICK.id, 100, nutritionDelta)).rejects.toThrow(
        'Recipe with id invalid-id does not exist',
      );
    });

    it('should merge amounts when adding duplicate ingredient', async () => {
      await prisma.recipeIngredient.create({
        data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 100 },
      });
      await prisma.recipe.update({
        where: { id: TEST_RECIPES.CHICKEN_CURRY.id },
        data: { calories: 200, carbs: 0, fat: 10 },
      });

      const additionalAmount = 50;
      const nutritionDelta = { calories: 100, carbs: 0, fat: 5 };

      await addIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, additionalAmount, nutritionDelta);

      const recipeIngredient = await prisma.recipeIngredient.findUnique({
        where: { recipeId_ingredientId: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id } },
      });
      expect(recipeIngredient?.amount).toEqual(150);

      const recipe = await prisma.recipe.findUnique({ where: { id: TEST_RECIPES.CHICKEN_CURRY.id } });
      expect(recipe).toMatchObject({
        calories: 300,
        carbs: 0,
        fat: 15,
      });
    });

    describe('updateIngredientAmount', () => {
      it('should update the amount of an ingredient in a recipe', async () => {
        await prisma.recipeIngredient.create({
          data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 0 },
        });
        const newAmount = 200;
        const nutritionDelta = { calories: 100, carbs: 20, fat: 5 };

        await updateIngredientAmount(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, newAmount, nutritionDelta);

        const recipeIngredient = await prisma.recipeIngredient.findUnique({
          where: { recipeId_ingredientId: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id } },
        });
        expect(recipeIngredient?.amount).toEqual(newAmount);
      });

      it('should update the macro values by the provided nutrition delta', async () => {
        await prisma.recipeIngredient.create({
          data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 100 },
        });
        await prisma.recipe.update({
          where: { id: TEST_RECIPES.CHICKEN_CURRY.id },
          data: { calories: 500, carbs: 50, fat: 25 },
        });
        const newAmount = 200;
        const nutritionDelta = { calories: 100, carbs: 20, fat: 5 };

        await updateIngredientAmount(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, newAmount, nutritionDelta);

        const recipe = await prisma.recipe.findUnique({ where: { id: TEST_RECIPES.CHICKEN_CURRY.id } });
        expect(recipe).toMatchObject({
          calories: 500 + nutritionDelta.calories,
          carbs: 50 + nutritionDelta.carbs,
          fat: 25 + nutritionDelta.fat,
        });
      });

      it('should return the updated recipe', async () => {
        (fetchRecipe as jest.Mock).mockResolvedValue('mock recipe');
        await prisma.recipeIngredient.create({
          data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 0 },
        });
        const newAmount = 200;
        const nutritionDelta = { calories: 100, carbs: 20, fat: 5 };

        const updatedRecipe = await updateIngredientAmount(
          TEST_RECIPES.CHICKEN_CURRY.id,
          TEST_INGREDIENTS.CHICK.id,
          newAmount,
          nutritionDelta,
        );

        expect(updatedRecipe).toEqual('mock recipe');
      });

      it('should throw an error if the ingredient is not in the recipe', async () => {
        const nutritionDelta = { calories: 100, carbs: 20, fat: 5 };
        await expect(updateIngredientAmount(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, 100, nutritionDelta)).rejects.toThrow(
          `Ingredient with id ${TEST_INGREDIENTS.CHICK.id} not found in recipe with id ${TEST_RECIPES.CHICKEN_CURRY.id}`,
        );
      });
    });

    describe('deleteRecipeIngredient', () => {
      it('should delete an ingredient from a recipe', async () => {
        await prisma.recipeIngredient.create({
          data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 100 },
        });
        const nutritionDelta = { calories: -200, carbs: -10, fat: -5 };

        await deleteRecipeIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, nutritionDelta);

        const recipeIngredient = await prisma.recipeIngredient.findUnique({
          where: { recipeId_ingredientId: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id } },
        });
        expect(recipeIngredient).toBeNull;
      });

      it('should update the macro values by the provided nutrition delta', async () => {
        await prisma.recipeIngredient.create({
          data: { recipeId: TEST_RECIPES.CHICKEN_CURRY.id, ingredientId: TEST_INGREDIENTS.CHICK.id, amount: 100 },
        });
        await prisma.recipe.update({
          where: { id: TEST_RECIPES.CHICKEN_CURRY.id },
          data: { calories: 200, carbs: 10, fat: 5 },
        });
        const nutritionDelta = { calories: -200, carbs: -10, fat: -5 };

        await deleteRecipeIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, nutritionDelta);

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
        const nutritionDelta = { calories: -200, carbs: -10, fat: -5 };

        const updatedRecipe = await deleteRecipeIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, nutritionDelta);

        expect(updatedRecipe).toEqual('mock recipe');
      });

      it('should throw an error if the ingredient is not in the recipe', async () => {
        const nutritionDelta = { calories: -200, carbs: -10, fat: -5 };
        await expect(deleteRecipeIngredient(TEST_RECIPES.CHICKEN_CURRY.id, TEST_INGREDIENTS.CHICK.id, nutritionDelta)).rejects.toThrow(
          `Ingredient with id ${TEST_INGREDIENTS.CHICK.id} not found in recipe with id ${TEST_RECIPES.CHICKEN_CURRY.id}`,
        );
      });
    });
  });
});
