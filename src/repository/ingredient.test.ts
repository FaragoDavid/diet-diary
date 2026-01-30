import { deleteIngredient, fetchIngredient, fetchIngredients, insertIngredient, updateIngredient } from '../repository/ingredient';
import prisma from '../utils/prisma-client';

describe('Ingredient Repository', () => {
  const TEST_INGREDIENTS = {
    CHICKEN: { name: 'chicken', caloriesPer100: 200, carbsPer100: 0, fatPer100: 10, isVegetable: false, isCarbCounted: true },
    BEEF: { name: 'beef', caloriesPer100: 300, carbsPer100: 0, fatPer100: 20, isVegetable: false, isCarbCounted: true },
    PORK: { name: 'pork', caloriesPer100: 250, carbsPer100: 0, fatPer100: 15, isVegetable: false, isCarbCounted: true },
  };

  describe('fetchIngredients', () => {
    beforeEach(async () => {
      await prisma.ingredient.createMany({
        data: [TEST_INGREDIENTS.CHICKEN, TEST_INGREDIENTS.BEEF, TEST_INGREDIENTS.PORK],
      });
    });

    it('should fetch all ingredients when no query is provided', async () => {
      const ingredients = await fetchIngredients();

      expect(ingredients).toEqual([
        { id: expect.any(String), ...TEST_INGREDIENTS.BEEF },
        { id: expect.any(String), ...TEST_INGREDIENTS.CHICKEN },
        { id: expect.any(String), ...TEST_INGREDIENTS.PORK },
      ]);
    });

    it('should fetch filtered ingredients when a query is provided', async () => {
      const ingredients = await fetchIngredients(TEST_INGREDIENTS.CHICKEN.name);

      expect(ingredients).toEqual([{ id: expect.any(String), ...TEST_INGREDIENTS.CHICKEN }]);
    });
  });

  describe('fetchIngredient', () => {
    it('should fetch an ingredient by id', async () => {
      const TEST_INGREDIENT_ID = (await prisma.ingredient.create({ data: TEST_INGREDIENTS.CHICKEN })).id;

      const ingredient = await fetchIngredient(TEST_INGREDIENT_ID);

      expect(ingredient).toEqual({ id: TEST_INGREDIENT_ID, ...TEST_INGREDIENTS.CHICKEN });
    });
  });

  describe('insertIngredient', () => {
    it('should insert a new ingredient', async () => {
      const ingredient = await insertIngredient(TEST_INGREDIENTS.CHICKEN.name);

      expect(ingredient).toEqual({
        id: expect.any(String),
        name: TEST_INGREDIENTS.CHICKEN.name,
        caloriesPer100: 0,
        carbsPer100: 0,
        fatPer100: 0,
        isVegetable: false,
        isCarbCounted: true,
      });
    });
  });

  describe('deleteIngredient', () => {
    it('should delete an ingredient by id', async () => {
      const TEST_INGREDIENT_ID = (await prisma.ingredient.create({ data: TEST_INGREDIENTS.CHICKEN })).id;
      await prisma.ingredient.create({ data: TEST_INGREDIENTS.BEEF });

      await deleteIngredient(TEST_INGREDIENT_ID);

      expect(await prisma.ingredient.findMany()).toEqual([{ id: expect.any(String), ...TEST_INGREDIENTS.BEEF }]);
    });
  });

  describe('updateIngredient', () => {
    it('should update an ingredient by id', async () => {
      const TEST_INGREDIENT_ID = (await prisma.ingredient.create({ data: TEST_INGREDIENTS.CHICKEN })).id;
      const testName = 'chicken 2';

      await updateIngredient(TEST_INGREDIENT_ID, { name: testName });

      expect(await prisma.ingredient.findMany()).toEqual([{ id: TEST_INGREDIENT_ID, ...TEST_INGREDIENTS.CHICKEN, name: testName }]);
    });

    it('should recalculate nutrition for all recipes using the ingredient when nutrition values change', async () => {
      const chicken = await prisma.ingredient.create({ data: TEST_INGREDIENTS.CHICKEN });
      const beef = await prisma.ingredient.create({ data: TEST_INGREDIENTS.BEEF });

      const recipe = await prisma.recipe.create({
        data: {
          name: 'Test Recipe',
          calories: 400,
          carbs: 0,
          fat: 20,
        },
      });

      await prisma.recipeIngredient.create({
        data: { recipeId: recipe.id, ingredientId: chicken.id, amount: 200 },
      });
      await prisma.recipeIngredient.create({
        data: { recipeId: recipe.id, ingredientId: beef.id, amount: 100 },
      });

      await updateIngredient(chicken.id, { caloriesPer100: 250, carbsPer100: 5, fatPer100: 12 });

      const updatedRecipe = await prisma.recipe.findUnique({ where: { id: recipe.id } });
      expect(updatedRecipe).toMatchObject({
        calories: 250 * 2 + 300 * 1,
        carbs: 5 * 2 + 0 * 1,
        fat: 12 * 2 + 20 * 1,
      });
    });

    it('should not affect recipes when non-nutrition fields are updated', async () => {
      const chicken = await prisma.ingredient.create({ data: TEST_INGREDIENTS.CHICKEN });

      const recipe = await prisma.recipe.create({
        data: {
          name: 'Test Recipe',
          calories: 400,
          carbs: 0,
          fat: 20,
        },
      });

      await prisma.recipeIngredient.create({
        data: { recipeId: recipe.id, ingredientId: chicken.id, amount: 200 },
      });

      await updateIngredient(chicken.id, { name: 'Chicken Breast' });

      const updatedRecipe = await prisma.recipe.findUnique({ where: { id: recipe.id } });
      expect(updatedRecipe).toMatchObject({
        calories: 400,
        carbs: 0,
        fat: 20,
      });
    });
  });
});
