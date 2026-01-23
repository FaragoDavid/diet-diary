import * as ingredientService from './ingredient.service';
import * as ingredientRepository from '../repository/ingredient';

jest.mock('../repository/ingredient');

const mockedIngredientRepository = ingredientRepository as jest.Mocked<typeof ingredientRepository>;

describe('ingredientService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('removeIngredient', () => {
    it('should remove ingredient and return filtered list', async () => {
      const mockIngredients = [
        { id: '2', name: 'beef', caloriesPer100: 300, carbsPer100: 0, fatPer100: 20, isVegetable: false, isCarbCounted: true },
      ];
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
      mockedIngredientRepository.deleteIngredient.mockResolvedValue(undefined);
      mockedIngredientRepository.fetchIngredients.mockResolvedValueOnce([]).mockResolvedValueOnce(allMockIngredients);

      const result = await ingredientService.removeIngredient('1', 'chicken');

      expect(result).toEqual(allMockIngredients);
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenCalledTimes(2);
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenNthCalledWith(1, 'chicken');
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenNthCalledWith(2);
    });
  });
});
