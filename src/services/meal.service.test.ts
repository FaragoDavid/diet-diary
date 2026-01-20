import { mealService } from './meal.service';
import { MealType } from '../config';
import * as ingredientRepository from '../repository/ingredient';
import * as mealRepository from '../repository/meal';
import * as recipeRepository from '../repository/recipe';

jest.mock('../repository/ingredient');
jest.mock('../repository/meal');
jest.mock('../repository/recipe');

const mockedIngredientRepository = ingredientRepository as jest.Mocked<typeof ingredientRepository>;
const mockedMealRepository = mealRepository as jest.Mocked<typeof mealRepository>;
const mockedRecipeRepository = recipeRepository as jest.Mocked<typeof recipeRepository>;

describe('MealService', () => {
  const mockDate = new Date('2024-01-15');
  const mockMealType: MealType = 'breakfast';

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
    type: 'breakfast' as MealType,
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

  describe('getDayWithResources', () => {
    it('should fetch day with ingredients and recipes in parallel', async () => {
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await mealService.getDayWithResources(mockDate);

      expect(result).toEqual({ day: mockDay, ingredients: mockIngredients, recipes: mockRecipes });
      expect(mockedMealRepository.fetchDay).toHaveBeenCalledWith(mockDate);
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenCalled();
      expect(mockedRecipeRepository.fetchRecipes).toHaveBeenCalled();
    });

    it('should return null when day not found', async () => {
      mockedMealRepository.fetchDay.mockResolvedValue(null);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await mealService.getDayWithResources(mockDate);

      expect(result).toBeNull();
    });
  });

  describe('getMealWithResources', () => {
    it('should fetch meal, day, and resources in parallel', async () => {
      mockedMealRepository.fetchMeal.mockResolvedValue(mockMeal);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await mealService.getMealWithResources(mockDate, mockMealType);

      expect(result).toEqual({ meal: mockMeal, day: mockDay, ingredients: mockIngredients, recipes: mockRecipes });
      expect(mockedMealRepository.fetchMeal).toHaveBeenCalledWith(mockDate, mockMealType);
      expect(mockedMealRepository.fetchDay).toHaveBeenCalledWith(mockDate);
    });

    it('should return null when meal not found', async () => {
      mockedMealRepository.fetchMeal.mockResolvedValue(null);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await mealService.getMealWithResources(mockDate, mockMealType);

      expect(result).toBeNull();
    });

    it('should return null when day not found', async () => {
      mockedMealRepository.fetchMeal.mockResolvedValue(mockMeal);
      mockedMealRepository.fetchDay.mockResolvedValue(null);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await mealService.getMealWithResources(mockDate, mockMealType);

      expect(result).toBeNull();
    });
  });

  describe('addDishToMeal', () => {
    it('should add dish and fetch all resources', async () => {
      mockedMealRepository.addDish.mockResolvedValue(mockDish);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);
      mockedMealRepository.fetchMeal.mockResolvedValue(mockMeal);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await mealService.addDishToMeal(mockDate, mockMealType, '1', 100);

      expect(result).toEqual({ dish: mockDish, day: mockDay, meal: mockMeal, ingredients: mockIngredients, recipes: mockRecipes });
      expect(mockedMealRepository.addDish).toHaveBeenCalledWith(mockDate, mockMealType, '1', 100);
    });

    it('should throw error when day not found after adding', async () => {
      mockedMealRepository.addDish.mockResolvedValue(mockDish);
      mockedMealRepository.fetchDay.mockResolvedValue(null);
      mockedMealRepository.fetchMeal.mockResolvedValue(mockMeal);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      await expect(mealService.addDishToMeal(mockDate, mockMealType, '1', 100)).rejects.toThrow('Day or meal not found after adding dish');
    });
  });

  describe('updateDishAmount', () => {
    it('should update dish amount and fetch resources', async () => {
      mockedMealRepository.updateDish.mockResolvedValue(undefined);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);
      mockedMealRepository.fetchMeal.mockResolvedValue(mockMeal);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await mealService.updateDishAmount('1', 200, mockDate, mockMealType);

      expect(result).toEqual({ day: mockDay, meal: mockMeal, ingredients: mockIngredients, recipes: mockRecipes });
      expect(mockedMealRepository.updateDish).toHaveBeenCalledWith('1', 200);
    });

    it('should throw error when meal not found after updating', async () => {
      mockedMealRepository.updateDish.mockResolvedValue(undefined);
      mockedMealRepository.fetchDay.mockResolvedValue(mockDay);
      mockedMealRepository.fetchMeal.mockResolvedValue(null);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

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
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await mealService.removeDish('1', mockDate, mockMealType);

      expect(result).toEqual({ meal: mockMeal, day: mockDay, ingredients: mockIngredients, recipes: mockRecipes });
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
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await mealService.addMealToDay(mockDate, mockMealType);

      expect(result).toEqual({ day: mockDay, ingredients: mockIngredients, recipes: mockRecipes });
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
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await mealService.removeMeal(mockDate, mockMealType);

      expect(result).toEqual({ day: mockDay, ingredients: mockIngredients, recipes: mockRecipes });
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

  describe('createNewDay', () => {
    it('should create day and fetch resources', async () => {
      mockedMealRepository.createDay.mockResolvedValue(mockDay);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await mealService.createNewDay(mockDate);

      expect(result).toEqual({ day: mockDay, ingredients: mockIngredients, recipes: mockRecipes });
      expect(mockedMealRepository.createDay).toHaveBeenCalledWith(mockDate);
    });
  });

  describe('getAllDays', () => {
    it('should fetch all days and resources in parallel', async () => {
      const mockDays = [mockDay];
      mockedMealRepository.fetchDays.mockResolvedValue(mockDays);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await mealService.getAllDays();

      expect(result).toEqual({ days: mockDays, ingredients: mockIngredients, recipes: mockRecipes });
      expect(mockedMealRepository.fetchDays).toHaveBeenCalled();
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenCalled();
      expect(mockedRecipeRepository.fetchRecipes).toHaveBeenCalled();
    });
  });
});
