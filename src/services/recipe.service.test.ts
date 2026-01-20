// @ts-nocheck
import { recipeService } from './recipe.service';
import * as ingredientRepository from '../repository/ingredient';
import * as recipeRepository from '../repository/recipe';
import * as recipeIngredientRepository from '../repository/recipe-ingredient';

jest.mock('../repository/ingredient');
jest.mock('../repository/recipe');
jest.mock('../repository/recipe-ingredient');

const mockedIngredientRepository = ingredientRepository as jest.Mocked<typeof ingredientRepository>;
const mockedRecipeRepository = recipeRepository as jest.Mocked<typeof recipeRepository>;
const mockedRecipeIngredientRepository = recipeIngredientRepository as jest.Mocked<typeof recipeIngredientRepository>;

describe('RecipeService', () => {
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

  describe('getAllRecipesWithIngredients', () => {
    it('should fetch all recipes and ingredients in parallel', async () => {
      const mockRecipes = [mockRecipe];
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);

      const result = await recipeService.getAllRecipesWithIngredients();

      expect(result).toEqual({ recipes: mockRecipes, ingredients: mockIngredients });
      expect(mockedRecipeRepository.fetchRecipes).toHaveBeenCalledWith(undefined);
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenCalled();
    });

    it('should fetch filtered recipes with query', async () => {
      const mockRecipes = [mockRecipe];
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);

      const result = await recipeService.getAllRecipesWithIngredients('test');

      expect(result).toEqual({ recipes: mockRecipes, ingredients: mockIngredients });
      expect(mockedRecipeRepository.fetchRecipes).toHaveBeenCalledWith('test');
    });
  });

  describe('getRecipeWithIngredients', () => {
    it('should fetch recipe and ingredients in parallel', async () => {
      mockedRecipeRepository.fetchRecipe.mockResolvedValue(mockRecipe);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);

      const result = await recipeService.getRecipeWithIngredients('1');

      expect(result).toEqual({ recipe: mockRecipe, ingredients: mockIngredients });
      expect(mockedRecipeRepository.fetchRecipe).toHaveBeenCalledWith('1');
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenCalled();
    });

    it('should throw error when recipe not found', async () => {
      mockedRecipeRepository.fetchRecipe.mockResolvedValue(null);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);

      await expect(recipeService.getRecipeWithIngredients('999')).rejects.toThrow('Recipe not found');
    });
  });

  describe('createNewRecipe', () => {
    it('should create recipe and fetch ingredients in parallel', async () => {
      mockedRecipeRepository.createRecipe.mockResolvedValue(mockRecipe);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);

      const result = await recipeService.createNewRecipe('Test Recipe');

      expect(result).toEqual({ recipe: mockRecipe, ingredients: mockIngredients });
      expect(mockedRecipeRepository.createRecipe).toHaveBeenCalledWith('Test Recipe');
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenCalled();
    });
  });

  describe('addIngredientToRecipe', () => {
    it('should add ingredient and fetch all resources', async () => {
      const ingredientAmount = { amount: 100, ingredient: mockIngredients[0] };
      mockedRecipeIngredientRepository.addIngredient.mockResolvedValue(ingredientAmount);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipe.mockResolvedValue(mockRecipe);

      const result = await recipeService.addIngredientToRecipe('1', '1', 100);

      expect(result).toEqual({
        ingredientAmount: ingredientAmount.amount,
        ingredient: mockIngredients[0],
        ingredients: mockIngredients,
        recipe: mockRecipe,
      });
      expect(mockedRecipeIngredientRepository.addIngredient).toHaveBeenCalledWith('1', '1', 100);
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenCalled();
      expect(mockedRecipeRepository.fetchRecipe).toHaveBeenCalledWith('1');
    });

    it('should throw error when recipe not found after adding', async () => {
      const ingredientAmount = { amount: 100, ingredient: mockIngredients[0] };
      mockedRecipeIngredientRepository.addIngredient.mockResolvedValue(ingredientAmount);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);
      mockedRecipeRepository.fetchRecipe.mockResolvedValue(null);

      await expect(recipeService.addIngredientToRecipe('1', '1', 100)).rejects.toThrow('Recipe not found after adding ingredient');
    });
  });

  describe('updateRecipeIngredientAmount', () => {
    it('should update recipe ingredient amount', async () => {
      mockedRecipeIngredientRepository.updateIngredientAmount.mockResolvedValue(mockRecipe);

      const result = await recipeService.updateRecipeIngredientAmount('1', '1', 200);

      expect(result).toEqual(mockRecipe);
      expect(mockedRecipeIngredientRepository.updateIngredientAmount).toHaveBeenCalledWith('1', '1', 200);
    });

    it('should throw error when recipe not found', async () => {
      mockedRecipeIngredientRepository.updateIngredientAmount.mockResolvedValue(null);

      await expect(recipeService.updateRecipeIngredientAmount('999', '1', 200)).rejects.toThrow('Recipe not found');
    });
  });

  describe('removeIngredientFromRecipe', () => {
    it('should remove ingredient and fetch ingredients', async () => {
      mockedRecipeIngredientRepository.deleteRecipeIngredient.mockResolvedValue(mockRecipe);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);

      const result = await recipeService.removeIngredientFromRecipe('1', '1');

      expect(result).toEqual({
        recipe: mockRecipe,
        recipeIngredientIds: ['1'],
        ingredients: mockIngredients,
      });
      expect(mockedRecipeIngredientRepository.deleteRecipeIngredient).toHaveBeenCalledWith('1', '1');
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenCalled();
    });

    it('should throw error when recipe not found', async () => {
      mockedRecipeIngredientRepository.deleteRecipeIngredient.mockResolvedValue(null);

      await expect(recipeService.removeIngredientFromRecipe('999', '1')).rejects.toThrow('Recipe not found');
    });
  });

  describe('updateRecipeServingAmount', () => {
    it('should update recipe serving amount', async () => {
      mockedRecipeRepository.updateRecipeAmount.mockResolvedValue(mockRecipe);

      const result = await recipeService.updateRecipeServingAmount('1', 2);

      expect(result).toEqual(mockRecipe);
      expect(mockedRecipeRepository.updateRecipeAmount).toHaveBeenCalledWith('1', 2);
    });
  });

  describe('removeRecipe', () => {
    it('should remove recipe and return filtered recipes', async () => {
      const mockRecipes = [mockRecipe];
      mockedRecipeRepository.deleteRecipe.mockResolvedValue(undefined);
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);

      const result = await recipeService.removeRecipe('1', 'test');

      expect(result).toEqual({ recipes: mockRecipes, ingredients: mockIngredients });
      expect(mockedRecipeRepository.deleteRecipe).toHaveBeenCalledWith('1');
      expect(mockedRecipeRepository.fetchRecipes).toHaveBeenCalledWith('test');
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenCalled();
    });

    it('should fetch all recipes when filtered list is empty', async () => {
      const mockRecipes = [mockRecipe];
      mockedRecipeRepository.deleteRecipe.mockResolvedValue(undefined);
      mockedRecipeRepository.fetchRecipes.mockResolvedValueOnce([]).mockResolvedValueOnce(mockRecipes);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);

      const result = await recipeService.removeRecipe('1', 'nonexistent');

      expect(result).toEqual({ recipes: mockRecipes, ingredients: mockIngredients });
      expect(mockedRecipeRepository.fetchRecipes).toHaveBeenCalledTimes(2);
      expect(mockedRecipeRepository.fetchRecipes).toHaveBeenNthCalledWith(1, 'nonexistent');
      expect(mockedRecipeRepository.fetchRecipes).toHaveBeenNthCalledWith(2, '');
    });
  });
});
