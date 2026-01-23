// @ts-nocheck
import * as recipeService from './recipe.service';
import * as ingredientRepository from '../repository/ingredient';
import * as recipeRepository from '../repository/recipe';
import * as recipeIngredientRepository from '../repository/recipe-ingredient';

jest.mock('../repository/ingredient');
jest.mock('../repository/recipe');
jest.mock('../repository/recipe-ingredient');

const mockedIngredientRepository = ingredientRepository as jest.Mocked<typeof ingredientRepository>;
const mockedRecipeRepository = recipeRepository as jest.Mocked<typeof recipeRepository>;
const mockedRecipeIngredientRepository = recipeIngredientRepository as jest.Mocked<typeof recipeIngredientRepository>;

describe('recipeService', () => {
  const mockIngredients = [
    { id: '1', name: 'chicken', caloriesPer100: 200, carbsPer100: 0, fatPer100: 10, isVegetable: false, isCarbCounted: true },
    { id: '2', name: 'beef', caloriesPer100: 300, carbsPer100: 0, fatPer100: 20, isVegetable: false, isCarbCounted: true },
  ];

  const mockRecipe = {
    id: '1',
    name: 'Test Recipe',
    servings: 1,
    caloriesPer100: 0,
    carbsPer100: 0,
    fatPer100: 0,
    ingredients: [
      {
        amount: 100,
        ingredient: mockIngredients[0],
      },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addIngredientToRecipe', () => {
    it('should add ingredient and fetch all resources', async () => {
      const ingredientAmount = { amount: 100, ingredient: mockIngredients[0] };
      mockedIngredientRepository.fetchIngredient.mockResolvedValue(mockIngredients[0]);
      mockedRecipeIngredientRepository.addIngredient.mockResolvedValue(ingredientAmount);
      mockedRecipeRepository.fetchRecipe.mockResolvedValue(mockRecipe);

      const result = await recipeService.addIngredientToRecipe('1', '1', 100);

      expect(result).toEqual({
        ingredientAmount: ingredientAmount.amount,
        ingredient: mockIngredients[0],
        recipe: mockRecipe,
      });
      expect(mockedIngredientRepository.fetchIngredient).toHaveBeenCalledWith('1');
      expect(mockedRecipeIngredientRepository.addIngredient).toHaveBeenCalledWith('1', '1', 100, {
        calories: 200,
        carbs: 0,
        fat: 10,
      });
      expect(mockedRecipeRepository.fetchRecipe).toHaveBeenCalledWith('1');
    });

    it('should throw error when recipe not found after adding', async () => {
      const ingredientAmount = { amount: 100, ingredient: mockIngredients[0] };
      mockedIngredientRepository.fetchIngredient.mockResolvedValue(mockIngredients[0]);
      mockedRecipeIngredientRepository.addIngredient.mockResolvedValue(ingredientAmount);
      mockedRecipeRepository.fetchRecipe.mockResolvedValue(null);

      await expect(recipeService.addIngredientToRecipe('1', '1', 100)).rejects.toThrow('Recipe not found after adding ingredient');
    });
  });

  describe('updateRecipeIngredientAmount', () => {
    it('should update recipe ingredient amount', async () => {
      mockedRecipeRepository.fetchRecipe.mockResolvedValue(mockRecipe);
      mockedRecipeIngredientRepository.updateIngredientAmount.mockResolvedValue(mockRecipe);

      const result = await recipeService.updateRecipeIngredientAmount('1', '1', 200);

      expect(result).toEqual(mockRecipe);
      expect(mockedRecipeRepository.fetchRecipe).toHaveBeenCalledWith('1');
      expect(mockedRecipeIngredientRepository.updateIngredientAmount).toHaveBeenCalledWith('1', '1', 200, {
        calories: 200,
        carbs: 0,
        fat: 10,
      });
    });

    it('should throw error when recipe not found', async () => {
      mockedRecipeRepository.fetchRecipe.mockResolvedValue(null);

      await expect(recipeService.updateRecipeIngredientAmount('999', '1', 200)).rejects.toThrow('Recipe not found');
    });
  });

  describe('removeIngredientFromRecipe', () => {
    it('should remove ingredient', async () => {
      mockedRecipeRepository.fetchRecipe.mockResolvedValue(mockRecipe);
      mockedRecipeIngredientRepository.deleteRecipeIngredient.mockResolvedValue(mockRecipe);

      const result = await recipeService.removeIngredientFromRecipe('1', '1');

      expect(result).toEqual(mockRecipe);
      expect(mockedRecipeRepository.fetchRecipe).toHaveBeenCalledWith('1');
      expect(mockedRecipeIngredientRepository.deleteRecipeIngredient).toHaveBeenCalledWith('1', '1', {
        calories: -200,
        carbs: -0,
        fat: -10,
      });
    });

    it('should throw error when recipe not found', async () => {
      mockedRecipeIngredientRepository.deleteRecipeIngredient.mockResolvedValue(null);

      await expect(recipeService.removeIngredientFromRecipe('999', '1')).rejects.toThrow('Recipe not found');
    });
  });

  describe('removeRecipe', () => {
    it('should remove recipe and return filtered recipes', async () => {
      const mockRecipes = [mockRecipe];
      mockedRecipeRepository.deleteRecipe.mockResolvedValue(undefined);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);

      const result = await recipeService.removeRecipe('1', 'test');

      expect(result).toEqual(mockRecipes);
      expect(mockedRecipeRepository.deleteRecipe).toHaveBeenCalledWith('1');
      expect(mockedRecipeRepository.fetchRecipes).toHaveBeenCalledWith('test');
    });

    it('should fetch all recipes when filtered list is empty', async () => {
      const mockRecipes = [mockRecipe];
      mockedRecipeRepository.deleteRecipe.mockResolvedValue(undefined);
      mockedRecipeRepository.fetchRecipes.mockResolvedValueOnce([]).mockResolvedValueOnce(mockRecipes);

      const result = await recipeService.removeRecipe('1', 'nonexistent');

      expect(result).toEqual(mockRecipes);
      expect(mockedRecipeRepository.fetchRecipes).toHaveBeenCalledTimes(2);
      expect(mockedRecipeRepository.fetchRecipes).toHaveBeenNthCalledWith(1, 'nonexistent');
      expect(mockedRecipeRepository.fetchRecipes).toHaveBeenNthCalledWith(2, '');
    });
  });
});
