import { format } from 'date-fns';
import { hu } from 'date-fns/locale';

import { MEAL_TYPE } from '../../config';
import prisma from '../../utils/prisma-client';
import createCookingVersion from './create-cooking-version';

describe('Create Cooking Version', () => {
  const TEST_DATE = new Date('2026-01-30');
  const TEST_DATE_PARAM = '20260130';

  describe('version name format', () => {
    it('formats version name with Hungarian locale', async () => {
      const recipe = await prisma.recipe.create({
        data: { name: 'Chicken Curry', servings: 1, calories: 0, carbs: 0, fat: 0 },
      });
      await prisma.day.create({ data: { date: TEST_DATE } });
      await prisma.meal.create({
        data: { date: TEST_DATE, type: MEAL_TYPE.breakfast, Day: { connect: { date: TEST_DATE } } },
      });
      const dish = await prisma.dish.create({
        data: {
          name: recipe.name,
          recipeId: recipe.id,
          amount: 1,
          calories: 0,
          carbs: 0,
          fat: 0,
          mealDate: TEST_DATE,
          mealType: MEAL_TYPE.breakfast,
        },
      });

      await createCookingVersion({ params: { date: TEST_DATE_PARAM, mealType: MEAL_TYPE.breakfast, dishId: dish.id } } as any, {} as any);

      const updatedDish = await prisma.dish.findUnique({ where: { id: dish.id } });
      expect(updatedDish?.name).toBe('Chicken Curry (jan. 30, 2026)');
    });

    it('uses correct Hungarian month abbreviations', () => {
      const testCases = [
        { date: new Date('2026-01-15'), expected: 'jan. 15, 2026' },
        { date: new Date('2026-02-20'), expected: 'febr. 20, 2026' },
        { date: new Date('2026-03-10'), expected: 'márc. 10, 2026' },
        { date: new Date('2026-04-05'), expected: 'ápr. 5, 2026' },
        { date: new Date('2026-05-25'), expected: 'máj. 25, 2026' },
        { date: new Date('2026-06-12'), expected: 'jún. 12, 2026' },
        { date: new Date('2026-07-08'), expected: 'júl. 8, 2026' },
        { date: new Date('2026-08-30'), expected: 'aug. 30, 2026' },
        { date: new Date('2026-09-18'), expected: 'szept. 18, 2026' },
        { date: new Date('2026-10-22'), expected: 'okt. 22, 2026' },
        { date: new Date('2026-11-11'), expected: 'nov. 11, 2026' },
        { date: new Date('2026-12-25'), expected: 'dec. 25, 2026' },
      ];

      testCases.forEach(({ date, expected }) => {
        expect(format(date, 'MMM d, yyyy', { locale: hu })).toBe(expected);
      });
    });
  });

  describe('creates cooking version from dish', () => {
    it('creates version with baseRecipeId pointing to original recipe', async () => {
      const recipe = await prisma.recipe.create({
        data: { name: 'Beef Stew', servings: 2, calories: 500, carbs: 30, fat: 20 },
      });
      await prisma.day.create({ data: { date: TEST_DATE } });
      await prisma.meal.create({
        data: { date: TEST_DATE, type: MEAL_TYPE.lunch, Day: { connect: { date: TEST_DATE } } },
      });
      const dish = await prisma.dish.create({
        data: {
          name: recipe.name,
          recipeId: recipe.id,
          amount: 1,
          calories: 500,
          carbs: 30,
          fat: 20,
          mealDate: TEST_DATE,
          mealType: MEAL_TYPE.lunch,
        },
      });

      await createCookingVersion({ params: { date: TEST_DATE_PARAM, mealType: MEAL_TYPE.lunch, dishId: dish.id } } as any, {} as any);

      const updatedDish = await prisma.dish.findUnique({ where: { id: dish.id } });
      const version = await prisma.recipe.findUnique({ where: { id: updatedDish!.recipeId! } });

      expect(version?.baseRecipeId).toBe(recipe.id);
      expect(version?.calories).toBe(500);
      expect(version?.carbs).toBe(30);
      expect(version?.fat).toBe(20);
      expect(version?.servings).toBe(2);
    });

    it('copies ingredients from base recipe to version', async () => {
      const chicken = await prisma.ingredient.create({ data: { name: 'chicken' } });
      const rice = await prisma.ingredient.create({ data: { name: 'rice' } });
      const recipe = await prisma.recipe.create({
        data: {
          name: 'Chicken Rice',
          servings: 1,
          calories: 400,
          carbs: 50,
          fat: 10,
          ingredients: {
            create: [
              { amount: 200, ingredientId: chicken.id },
              { amount: 150, ingredientId: rice.id },
            ],
          },
        },
      });
      await prisma.day.create({ data: { date: TEST_DATE } });
      await prisma.meal.create({
        data: { date: TEST_DATE, type: MEAL_TYPE.dinner, Day: { connect: { date: TEST_DATE } } },
      });
      const dish = await prisma.dish.create({
        data: {
          name: recipe.name,
          recipeId: recipe.id,
          amount: 1,
          calories: 400,
          carbs: 50,
          fat: 10,
          mealDate: TEST_DATE,
          mealType: MEAL_TYPE.dinner,
        },
      });

      await createCookingVersion({ params: { date: TEST_DATE_PARAM, mealType: MEAL_TYPE.dinner, dishId: dish.id } } as any, {} as any);

      const updatedDish = await prisma.dish.findUnique({ where: { id: dish.id } });
      const versionIngredients = await prisma.recipeIngredient.findMany({
        where: { recipeId: updatedDish!.recipeId! },
        orderBy: { amount: 'asc' },
      });

      expect(versionIngredients).toHaveLength(2);
      expect(versionIngredients[0]).toMatchObject({ amount: 150, ingredientId: rice.id });
      expect(versionIngredients[1]).toMatchObject({ amount: 200, ingredientId: chicken.id });
    });

    it('updates dish to point to version recipe', async () => {
      const recipe = await prisma.recipe.create({
        data: { name: 'Pasta', servings: 1, calories: 0, carbs: 0, fat: 0 },
      });
      await prisma.day.create({ data: { date: TEST_DATE } });
      await prisma.meal.create({
        data: { date: TEST_DATE, type: MEAL_TYPE.breakfast, Day: { connect: { date: TEST_DATE } } },
      });
      const dish = await prisma.dish.create({
        data: {
          name: recipe.name,
          recipeId: recipe.id,
          amount: 1,
          calories: 0,
          carbs: 0,
          fat: 0,
          mealDate: TEST_DATE,
          mealType: MEAL_TYPE.breakfast,
        },
      });

      await createCookingVersion({ params: { date: TEST_DATE_PARAM, mealType: MEAL_TYPE.breakfast, dishId: dish.id } } as any, {} as any);

      const updatedDish = await prisma.dish.findUnique({ where: { id: dish.id } });
      expect(updatedDish?.recipeId).not.toBe(recipe.id);
      expect(updatedDish?.name).toBe('Pasta (jan. 30, 2026)');
    });
  });

  describe('error handling', () => {
    it('returns error when dish not found', async () => {
      const result = await createCookingVersion(
        { params: { date: TEST_DATE_PARAM, mealType: MEAL_TYPE.breakfast, dishId: 'non-existent' } } as any,
        {} as any,
      );

      expect(result).toEqual({ error: 'Dish not found or not a recipe dish' });
    });

    it('returns error when dish has no recipeId', async () => {
      await prisma.day.create({ data: { date: TEST_DATE } });
      await prisma.meal.create({
        data: { date: TEST_DATE, type: MEAL_TYPE.breakfast, Day: { connect: { date: TEST_DATE } } },
      });
      const dish = await prisma.dish.create({
        data: {
          name: 'Ingredient Dish',
          ingredientId: null,
          recipeId: null,
          amount: 100,
          calories: 0,
          carbs: 0,
          fat: 0,
          mealDate: TEST_DATE,
          mealType: MEAL_TYPE.breakfast,
        },
      });

      const result = await createCookingVersion(
        { params: { date: TEST_DATE_PARAM, mealType: MEAL_TYPE.breakfast, dishId: dish.id } } as any,
        {} as any,
      );

      expect(result).toEqual({ error: 'Dish not found or not a recipe dish' });
    });
  });
});
