import {
  fetchRecipes,
  fetchRecipe,
  createRecipe,
  deleteRecipe,
  updateRecipeAmount,
} from '../repository/recipe';
import prisma from '../utils/prisma-client';

describe('Recipe Repository', () => {
  const TEST_RECIPES = {
    CHICKEN_CURRY: { name: 'chicken curry', amount: null, servings: 1, calories: 0, carbs: 0, fat: 0 },
    BEEF_STEW: { name: 'beef stew', amount: null, servings: 1, calories: 0, carbs: 0, fat: 0 },
    PORK_CHOPS: { name: 'pork chops', amount: null, servings: 1, calories: 0, carbs: 0, fat: 0 },
  };

  describe('fetchRecipes', () => {
    beforeEach(async () => {
      await prisma.recipe.createMany({
        data: [TEST_RECIPES.CHICKEN_CURRY, TEST_RECIPES.BEEF_STEW, TEST_RECIPES.PORK_CHOPS],
      });
    });

    it('fetches recipes with no query', async () => {
      const recipes = await fetchRecipes();

      expect(recipes).toEqual([
        { id: expect.any(String), ...TEST_RECIPES.BEEF_STEW, ingredients: [] },
        { id: expect.any(String), ...TEST_RECIPES.CHICKEN_CURRY, ingredients: [] },
        { id: expect.any(String), ...TEST_RECIPES.PORK_CHOPS, ingredients: [] },
      ]);
    });

    it('fetches recipes with a query', async () => {
      const recipes = await fetchRecipes(TEST_RECIPES.BEEF_STEW.name);

      expect(recipes).toEqual([{ id: expect.any(String), ...TEST_RECIPES.BEEF_STEW, ingredients: [] }]);
    });
  });

  describe('fetchRecipe', () => {
    it('fetches a recipe by id', async () => {
      const TEST_RECIPE_ID = (await prisma.recipe.create({ data: TEST_RECIPES.CHICKEN_CURRY })).id;

      const recipe = await fetchRecipe(TEST_RECIPE_ID);

      expect(recipe).toEqual({ id: TEST_RECIPE_ID, ...TEST_RECIPES.CHICKEN_CURRY, ingredients: [] });
    });
  });

  describe('createRecipe', () => {
    it('creates a new recipe', async () => {
      await createRecipe(TEST_RECIPES.CHICKEN_CURRY.name);

      const recipe = await prisma.recipe.findFirst({ where: { name: TEST_RECIPES.CHICKEN_CURRY.name } });
      expect(recipe).not.toBeNull();
    });

    it('returns the created recipe', async () => {
      const recipe = await createRecipe(TEST_RECIPES.CHICKEN_CURRY.name);

      expect(recipe).toMatchObject({ ...TEST_RECIPES.CHICKEN_CURRY, ingredients: [] });
    });
  });

  describe('deleteRecipe', () => {
    it('deletes a recipe', async () => {
      const TEST_RECIPE_ID = (await prisma.recipe.create({ data: TEST_RECIPES.CHICKEN_CURRY })).id;
      await prisma.recipe.create({ data: TEST_RECIPES.BEEF_STEW });

      await deleteRecipe(TEST_RECIPE_ID);

      expect(await prisma.recipe.findMany()).toEqual([{ id: expect.any(String), ...TEST_RECIPES.BEEF_STEW }]);
    });

    it('deletes the ingredients of the recipe', async () => {
      const TEST_INGREDIENT_ID = (await prisma.ingredient.create({ data: { name: 'chicken' } })).id;
      const TEST_RECIPE_ID = (await prisma.recipe.create({ data: TEST_RECIPES.CHICKEN_CURRY })).id;
      await prisma.recipeIngredient.createMany({
        data: [{ amount: 100, ingredientId: TEST_INGREDIENT_ID, recipeId: TEST_RECIPE_ID }],
      });

      await deleteRecipe(TEST_RECIPE_ID);

      expect(await prisma.recipeIngredient.findMany()).toEqual([]);
    });
  });

  describe('updateRecipeAmount', () => {
    it('updates the amount of a recipe', async () => {
      const TEST_RECIPE_ID = (await prisma.recipe.create({ data: TEST_RECIPES.CHICKEN_CURRY })).id;
      const newAmount = 2;

      await updateRecipeAmount(TEST_RECIPE_ID, newAmount);

      expect(await prisma.recipe.findUnique({ where: { id: TEST_RECIPE_ID } })).toEqual({
        id: TEST_RECIPE_ID,
        ...TEST_RECIPES.CHICKEN_CURRY,
        amount: newAmount,
      });
    });
  });
});
