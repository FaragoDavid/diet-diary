import { addMeal, deleteMeal, addDish, deleteDish, updateDish, fetchDish } from './meal';
import { MEAL_TYPE } from '../config';
import prisma from '../utils/prisma-client';

describe('Meal Repository', () => {
  const TEST_DATE = new Date('2024-01-15');

  describe('addMeal', () => {
    beforeEach(async () => {
      await prisma.day.create({ data: { date: TEST_DATE } });
    });

    it('should add a meal successfully', async () => {
      const meal = await addMeal(TEST_DATE, MEAL_TYPE.breakfast);

      expect(meal).toEqual({
        type: MEAL_TYPE.breakfast,
        calories: null,
        carbs: null,
        fat: null,
        dishes: [],
      });
    });
  });

  describe('deleteMeal', () => {
    beforeEach(async () => {
      await prisma.day.create({ data: { date: TEST_DATE } });
      await prisma.meal.create({
        data: { date: TEST_DATE, type: MEAL_TYPE.breakfast, Day: { connect: { date: TEST_DATE } } },
      });
    });

    it('should delete an existing meal', async () => {
      await deleteMeal(TEST_DATE, MEAL_TYPE.breakfast);

      const meals = await prisma.meal.findMany();
      expect(meals).toEqual([]);
    });
  });

  describe('addDish', () => {
    beforeEach(async () => {
      await prisma.day.create({ data: { date: TEST_DATE } });
      await prisma.meal.create({
        data: { date: TEST_DATE, type: MEAL_TYPE.breakfast, Day: { connect: { date: TEST_DATE } } },
      });
    });

    it('should add a dish with nutrition data', async () => {
      const dishData = {
        name: 'Chicken',
        ingredientId: null,
        recipeId: null,
        amount: 150,
        calories: 300,
        carbs: 15,
        fat: 7.5,
      };

      const dish = await addDish(TEST_DATE, MEAL_TYPE.breakfast, dishData);

      expect(dish).toEqual({
        id: expect.any(String),
        name: 'Chicken',
        amount: 150,
        calories: 300,
        carbs: 15,
        fat: 7.5,
        ingredientId: null,
        recipeId: null,
      });
    });
  });

  describe('fetchDish', () => {
    it('should fetch a dish by id', async () => {
      await prisma.day.create({ data: { date: TEST_DATE } });
      await prisma.meal.create({
        data: { date: TEST_DATE, type: MEAL_TYPE.breakfast, Day: { connect: { date: TEST_DATE } } },
      });

      const createdDish = await prisma.dish.create({
        data: {
          mealDate: TEST_DATE,
          mealType: MEAL_TYPE.breakfast,
          name: 'Test Dish',
          ingredientId: null,
          amount: 100,
          calories: 200,
          carbs: 10,
          fat: 5,
        },
      });

      const dish = await fetchDish(createdDish.id);

      expect(dish).toEqual({
        id: createdDish.id,
        name: 'Test Dish',
        amount: 100,
        calories: 200,
        carbs: 10,
        fat: 5,
        ingredientId: null,
        recipeId: null,
      });
    });
  });

  describe('deleteDish', () => {
    it('should delete an existing dish', async () => {
      await prisma.day.create({ data: { date: TEST_DATE } });
      await prisma.meal.create({
        data: { date: TEST_DATE, type: MEAL_TYPE.breakfast, Day: { connect: { date: TEST_DATE } } },
      });

      const dish = await prisma.dish.create({
        data: {
          mealDate: TEST_DATE,
          mealType: MEAL_TYPE.breakfast,
          name: 'Test Dish',
          ingredientId: null,
          amount: 100,
          calories: 200,
          carbs: 10,
          fat: 5,
        },
      });

      await deleteDish(dish.id);

      const dishes = await prisma.dish.findMany();
      expect(dishes).toEqual([]);
    });
  });

  describe('updateDish', () => {
    it('should update an existing dish with new amounts', async () => {
      await prisma.day.create({ data: { date: TEST_DATE } });
      await prisma.meal.create({
        data: { date: TEST_DATE, type: MEAL_TYPE.breakfast, Day: { connect: { date: TEST_DATE } } },
      });

      const dish = await prisma.dish.create({
        data: {
          mealDate: TEST_DATE,
          mealType: MEAL_TYPE.breakfast,
          name: 'Test Dish',
          ingredientId: null,
          amount: 100,
          calories: 200,
          carbs: 10,
          fat: 5,
        },
      });

      await updateDish(dish.id, {
        amount: 150,
        calories: 300,
        carbs: 15,
        fat: 7.5,
      });

      const updatedDish = await prisma.dish.findUnique({ where: { id: dish.id } });
      expect(updatedDish).toEqual({
        id: dish.id,
        mealDate: TEST_DATE,
        mealType: MEAL_TYPE.breakfast,
        name: 'Test Dish',
        ingredientId: null,
        recipeId: null,
        amount: 150,
        calories: 300,
        carbs: 15,
        fat: 7.5,
      });
    });
  });
});
