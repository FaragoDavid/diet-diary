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

      expect(ingredients).toEqual([
        { id: expect.any(String), ...TEST_INGREDIENTS.CHICKEN },
      ]);
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
      const testName = 'chicken 2'
      
      await updateIngredient(TEST_INGREDIENT_ID, { name: testName });

      expect(await prisma.ingredient.findMany()).toEqual([{ id: TEST_INGREDIENT_ID, ...TEST_INGREDIENTS.CHICKEN, name: testName }]);
    });
  });
});
