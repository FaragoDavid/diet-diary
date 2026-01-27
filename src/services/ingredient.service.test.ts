import * as ingredientService from './ingredient.service';
import * as ingredientRepository from '../repository/ingredient';
import * as recipeRepository from '../repository/recipe';

jest.mock('../repository/ingredient');
jest.mock('../repository/recipe');

const mockedIngredientRepository = ingredientRepository as jest.Mocked<typeof ingredientRepository>;
const mockedRecipeRepository = recipeRepository as jest.Mocked<typeof recipeRepository>;

describe('ingredientService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('removeIngredient', () => {
    it('should remove ingredient and return filtered list', async () => {
      const mockIngredients = [
        { id: '2', name: 'beef', caloriesPer100: 300, carbsPer100: 0, fatPer100: 20, isVegetable: false, isCarbCounted: true },
      ];
      mockedRecipeRepository.fetchRecipes.mockResolvedValue([]);
      mockedIngredientRepository.deleteIngredient.mockResolvedValue(undefined);
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);

      const result = await ingredientService.removeIngredient('1', 'beef');

      expect(result).toEqual(mockIngredients);
      expect(mockedIngredientRepository.deleteIngredient).toHaveBeenCalledWith('1');
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenCalledWith('beef');
    });

    it('should fetch all ingredients when filtered list is empty', async () => {
      const allMockIngredients = [
        { id: '2', name: 'beef', caloriesPer100: 300, carbsPer100: 0, fatPer100: 20, isVegetable: false, isCarbCounted: true },
        { id: '3', name: 'pork', caloriesPer100: 250, carbsPer100: 0, fatPer100: 15, isVegetable: false, isCarbCounted: true },
      ];
      mockedRecipeRepository.fetchRecipes.mockResolvedValue([]);
      mockedIngredientRepository.deleteIngredient.mockResolvedValue(undefined);
      mockedIngredientRepository.fetchIngredients.mockResolvedValueOnce([]).mockResolvedValueOnce(allMockIngredients);

      const result = await ingredientService.removeIngredient('1', 'chicken');

      expect(result).toEqual(allMockIngredients);
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenCalledTimes(2);
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenNthCalledWith(1, 'chicken');
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenNthCalledWith(2);
    });

    it('should throw error when ingredient is used in recipes', async () => {
      const mockRecipes = [
        {
          id: '1',
          name: 'Chicken Curry',
          ingredients: [{ amount: 100, ingredient: { id: '1', name: 'chicken' } }],
        },
      ];
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes as any);

      await expect(ingredientService.removeIngredient('1')).rejects.toThrow(
        'Cannot delete ingredient. It is used in 1 recipe(s): Chicken Curry',
      );
      expect(mockedIngredientRepository.deleteIngredient).not.toHaveBeenCalled();
    });

    it('should throw error when ingredient is used in multiple recipes', async () => {
      const mockRecipes = [
        {
          id: '1',
          name: 'Chicken Curry',
          ingredients: [{ amount: 100, ingredient: { id: '1', name: 'chicken' } }],
        },
        {
          id: '2',
          name: 'Chicken Soup',
          ingredients: [{ amount: 200, ingredient: { id: '1', name: 'chicken' } }],
        },
      ];
      mockedRecipeRepository.fetchRecipes.mockResolvedValue(mockRecipes as any);

      await expect(ingredientService.removeIngredient('1')).rejects.toThrow(
        'Cannot delete ingredient. It is used in 2 recipe(s): Chicken Curry, Chicken Soup',
      );
      expect(mockedIngredientRepository.deleteIngredient).not.toHaveBeenCalled();
    });
  });
});
