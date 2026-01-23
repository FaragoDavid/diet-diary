// @ts-nocheck
import * as mealService from './meal.service';
import { MEAL_TYPE, MealType } from '../config';
import * as ingredientRepository from '../repository/ingredient';
import * as mealRepository from '../repository/meal';
import * as recipeRepository from '../repository/recipe';

jest.mock('../repository/ingredient');
jest.mock('../repository/meal');
jest.mock('../repository/recipe');

const mockedIngredientRepository = ingredientRepository as jest.Mocked<typeof ingredientRepository>;
const mockedMealRepository = mealRepository as jest.Mocked<typeof mealRepository>;
const mockedRecipeRepository = recipeRepository as jest.Mocked<typeof recipeRepository>;

describe('mealService', () => {
  const mockDate = new Date('2024-01-15');
  const mockMealType: MealType = MEAL_TYPE.breakfast;

  const mockIngredients = [
    { id: '1', name: 'chicken', caloriesPer100: 200, carbsPer100: 0, fatPer100: 10, isVegetable: false, isCarbCounted: true },
  ];

  const mockRecipes = [
    {
      id: '1',
      name: 'Test Recipe',
      servings: 1,
      caloriesPer100: 0,
      carbsPer100: 0,
      fatPer100: 0,
      ingredients: [],
    },
  ];

  const mockDish = {
    id: '1',
    amount: 100,
    ingredientId: '1',
    recipeId: null,
    mealId: '1',
  };

  const mockMeal = {
    id: '1',
    type: MEAL_TYPE.breakfast as MealType,
    dayId: '1',
    dishes: [mockDish],
  };

  const mockDay = {
    id: '1',
    date: mockDate,
    meals: [mockMeal],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMealWithResources', () => {
    it('should fetch meal, day, and resources in parallel', async () => {
      mockedMealRepository.fetchMeal.mockResolvedValue(mockMeal);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await mealService.getMealWithResources(mockDate, mockMealType);

      expect(result).toEqual({ meal: mockMeal, day: mockDay });
      expect(mockedMealRepository.fetchMeal).toHaveBeenCalledWith(mockDate, mockMealType);
      expect(mockedMealRepository.fetchDay).toHaveBeenCalledWith(mockDate);
    });

    it('should return null when meal not found', async () => {
      mockedMealRepository.fetchMeal.mockResolvedValue(null);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);

      const result = await mealService.getMealWithResources(mockDate, mockMealType);

      expect(result).toBeNull();
    });

    it('should return null when day not found', async () => {
      mockedMealRepository.fetchMeal.mockResolvedValue(mockMeal);
      mockedMealRepository.fetchDay.mockResolvedValue(null);

      const result = await mealService.getMealWithResources(mockDate, mockMealType);

      expect(result).toBeNull();
    });
  });

  describe('addDishToMeal', () => {
    it('should calculate nutrition for ingredient and pass to repository', async () => {
      const mockIngredient = {
        id: '1',
        name: 'chicken',
        caloriesPer100: 200,
        carbsPer100: 10,
        fatPer100: 5,
        isVegetable: false,
        isCarbCounted: true,
      };
      mockedIngredientRepository.fetchIngredient.mockResolvedValue(mockIngredient);
      mockedRecipeRepository.fetchRecipe.mockResolvedValue(null);
      mockedMealRepository.addDish.mockResolvedValue(mockDish);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);
      mockedMealRepository.fetchMeal.mockResolvedValue(mockMeal);

      const result = await mealService.addDishToMeal(mockDate, mockMealType, '1', 150);

      expect(result).toEqual({ dish: mockDish, day: mockDay, meal: mockMeal });
      expect(mockedMealRepository.addDish).toHaveBeenCalledWith(mockDate, mockMealType, {
        name: 'chicken',
        ingredientId: '1',
        recipeId: null,
        amount: 150,
        calories: 300,
        carbs: 15,
        fat: 7.5,
      });
    });

    it('should calculate nutrition for recipe and pass to repository', async () => {
      const mockRecipe = {
        id: 'r1',
        name: 'Test Recipe',
        servings: 2,
        caloriesPer100: 0,
        carbsPer100: 0,
        fatPer100: 0,
        ingredients: [
          {
            amount: 100,
            ingredient: {
              id: '1',
              name: 'chicken',
              caloriesPer100: 200,
              carbsPer100: 10,
              fatPer100: 5,
              isVegetable: false,
              isCarbCounted: true,
            },
          },
          {
            amount: 50,
            ingredient: {
              id: '2',
              name: 'rice',
              caloriesPer100: 100,
              carbsPer100: 80,
              fatPer100: 1,
              isVegetable: false,
              isCarbCounted: true,
            },
          },
        ],
      };
      mockedIngredientRepository.fetchIngredient.mockResolvedValue(null);
      mockedRecipeRepository.fetchRecipe.mockResolvedValue(mockRecipe);
      mockedMealRepository.addDish.mockResolvedValue(mockDish);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);
      mockedMealRepository.fetchMeal.mockResolvedValue(mockMeal);

      const result = await mealService.addDishToMeal(mockDate, mockMealType, 'r1', 2);

      expect(result).toEqual({ dish: mockDish, day: mockDay, meal: mockMeal });
      expect(mockedMealRepository.addDish).toHaveBeenCalledWith(mockDate, mockMealType, {
        name: 'Test Recipe',
        ingredientId: null,
        recipeId: 'r1',
        amount: 2,
        calories: 500,
        carbs: 100,
        fat: 11,
      });
    });

    it('should throw error when day not found after adding', async () => {
      mockedIngredientRepository.fetchIngredient.mockResolvedValue(mockIngredients[0]);
      mockedMealRepository.addDish.mockResolvedValue(mockDish);
      mockedMealRepository.fetchDay.mockResolvedValue(null);
      mockedMealRepository.fetchMeal.mockResolvedValue(mockMeal);

      await expect(mealService.addDishToMeal(mockDate, mockMealType, '1', 100)).rejects.toThrow('Day or meal not found after adding dish');
    });
  });

  describe('updateDishAmount', () => {
    it('should calculate nutrition delta and update dish', async () => {
      const mockDishWithNutrition = {
        id: '1',
        amount: 100,
        calories: 200,
        carbs: 10,
        fat: 5,
        ingredientId: '1',
        recipeId: null,
        name: 'chicken',
      };
      mockedMealRepository.fetchDish.mockResolvedValue(mockDishWithNutrition);
      mockedMealRepository.updateDish.mockResolvedValue(undefined);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);
      mockedMealRepository.fetchMeal.mockResolvedValue(mockMeal);

      const result = await mealService.updateDishAmount('1', 150, mockDate, mockMealType);

      expect(result).toEqual({ day: mockDay, meal: mockMeal });
      expect(mockedMealRepository.updateDish).toHaveBeenCalledWith('1', {
        amount: 150,
        calories: 300,
        carbs: 15,
        fat: 7.5,
      });
    });

    it('should throw error when meal not found after updating', async () => {
      const mockDishWithNutrition = {
        id: '1',
        amount: 100,
        calories: 200,
        carbs: 10,
        fat: 5,
        ingredientId: '1',
        recipeId: null,
        name: 'chicken',
      };
      mockedMealRepository.fetchDish.mockResolvedValue(mockDishWithNutrition);
      mockedMealRepository.updateDish.mockResolvedValue(undefined);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);
      mockedMealRepository.fetchMeal.mockResolvedValue(null);

      await expect(mealService.updateDishAmount('1', 200, mockDate, mockMealType)).rejects.toThrow(
        'Day or meal not found after updating dish',
      );
    });
  });

  describe('removeDish', () => {
    it('should remove dish and fetch resources', async () => {
      mockedMealRepository.deleteDish.mockResolvedValue(undefined);
      mockedMealRepository.fetchMeal.mockResolvedValue(mockMeal);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);

      const result = await mealService.removeDish('1', mockDate, mockMealType);

      expect(result).toEqual({ meal: mockMeal, day: mockDay });
      expect(mockedMealRepository.deleteDish).toHaveBeenCalledWith('1');
    });

    it('should throw error when day not found after deleting', async () => {
      mockedMealRepository.deleteDish.mockResolvedValue(undefined);
      mockedMealRepository.fetchMeal.mockResolvedValue(mockMeal);
      mockedMealRepository.fetchDay.mockResolvedValue(null);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      await expect(mealService.removeDish('1', mockDate, mockMealType)).rejects.toThrow('Meal or day not found after deleting dish');
    });
  });

  describe('addMealToDay', () => {
    it('should add meal and fetch resources', async () => {
      mockedMealRepository.addMeal.mockResolvedValue(undefined);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);

      const result = await mealService.addMealToDay(mockDate, mockMealType);

      expect(result).toEqual(mockDay);
      expect(mockedMealRepository.addMeal).toHaveBeenCalledWith(mockDate, mockMealType);
    });

    it('should throw error when day not found after adding meal', async () => {
      mockedMealRepository.addMeal.mockResolvedValue(undefined);
      mockedMealRepository.fetchDay.mockResolvedValue(null);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      await expect(mealService.addMealToDay(mockDate, mockMealType)).rejects.toThrow('Day not found after adding meal');
    });
  });

  describe('removeMeal', () => {
    it('should remove meal and fetch resources', async () => {
      mockedMealRepository.deleteMeal.mockResolvedValue(undefined);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);

      const result = await mealService.removeMeal(mockDate, mockMealType);

      expect(result).toEqual(mockDay);
      expect(mockedMealRepository.deleteMeal).toHaveBeenCalledWith(mockDate, mockMealType);
    });

    it('should throw error when day not found after deleting meal', async () => {
      mockedMealRepository.deleteMeal.mockResolvedValue(undefined);
      mockedMealRepository.fetchDay.mockResolvedValue(null);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      await expect(mealService.removeMeal(mockDate, mockMealType)).rejects.toThrow('Day not found after deleting meal');
    });
  });
});
