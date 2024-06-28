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
    CHICKEN_CURRY: { name: 'chicken curry', amount: null, servings: null },
    BEEF_STEW: { name: 'beef stew', amount: null, servings: null },
    PORK_CHOPS: { name: 'pork chops', amount: null, servings: null },
  };

  describe('fetchRecipes', () => {
    beforeEach(async () => {
      await prisma.recipe.createMany({
        data: [TEST_RECIPES.CHICKEN_CURRY, TEST_RECIPES.BEEF_STEW, TEST_RECIPES.PORK_CHOPS],
      });
    });

    it('should fetch recipes with no query', async () => {
      const recipes = await fetchRecipes();

      expect(recipes).toEqual([
        { id: expect.any(String), ...TEST_RECIPES.BEEF_STEW, ingredients: [] },
        { id: expect.any(String), ...TEST_RECIPES.CHICKEN_CURRY, ingredients: [] },
        { id: expect.any(String), ...TEST_RECIPES.PORK_CHOPS, ingredients: [] },
      ]);
    });

    it('should fetch recipes with a query', async () => {
      const recipes = await fetchRecipes(TEST_RECIPES.BEEF_STEW.name);

      expect(recipes).toEqual([{ id: expect.any(String), ...TEST_RECIPES.BEEF_STEW, ingredients: [] }]);
    });
  });

  describe('fetchRecipe', () => {
    it('should fetch a recipe by id', async () => {
      const TEST_RECIPE_ID = (await prisma.recipe.create({ data: TEST_RECIPES.CHICKEN_CURRY })).id;

      const recipe = await fetchRecipe(TEST_RECIPE_ID);

      expect(recipe).toEqual({ id: TEST_RECIPE_ID, ...TEST_RECIPES.CHICKEN_CURRY, ingredients: []})
    });
  });

  describe('createRecipe', () => {
    it('should create a new recipe', async () => {
      const recipe = await createRecipe(TEST_RECIPES.CHICKEN_CURRY.name);

      expect(recipe).toEqual({
        id: expect.any(String),
        ...TEST_RECIPES.CHICKEN_CURRY,
        ingredients: [],
      });
    });
  });

  describe('deleteRecipe', () => {
    it('should delete a recipe by id', async () => {
      const TEST_RECIPE_ID = (await prisma.recipe.create({ data: TEST_RECIPES.CHICKEN_CURRY })).id;
      await prisma.recipe.create({ data: TEST_RECIPES.BEEF_STEW });

      await deleteRecipe(TEST_RECIPE_ID);

      expect(await prisma.recipe.findMany()).toEqual([{ id: expect.any(String), ...TEST_RECIPES.BEEF_STEW }]);
    });
  });

  describe('updateRecipeAmount', () => {
    it('should update the amount of a recipe', async () => {
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
