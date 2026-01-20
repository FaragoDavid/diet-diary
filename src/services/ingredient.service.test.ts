import { ingredientService } from './ingredient.service';
import * as ingredientRepository from '../repository/ingredient';

jest.mock('../repository/ingredient');

const mockedIngredientRepository = ingredientRepository as jest.Mocked<typeof ingredientRepository>;

describe('IngredientService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllIngredients', () => {
    it('should fetch all ingredients without query', async () => {
      const mockIngredients = [
        { id: '1', name: 'chicken', caloriesPer100: 200, carbsPer100: 0, fatPer100: 10, isVegetable: false, isCarbCounted: true },
        { id: '2', name: 'beef', caloriesPer100: 300, carbsPer100: 0, fatPer100: 20, isVegetable: false, isCarbCounted: true },
      ];
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);

      const result = await ingredientService.getAllIngredients();

      expect(result).toEqual(mockIngredients);
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenCalledWith(undefined);
    });

    it('should fetch filtered ingredients with query', async () => {
      const mockIngredients = [
        { id: '1', name: 'chicken', caloriesPer100: 200, carbsPer100: 0, fatPer100: 10, isVegetable: false, isCarbCounted: true },
      ];
      mockedIngredientRepository.fetchIngredients.mockResolvedValue(mockIngredients);

      const result = await ingredientService.getAllIngredients('chicken');

      expect(result).toEqual(mockIngredients);
      expect(mockedIngredientRepository.fetchIngredients).toHaveBeenCalledWith('chicken');
    });
  });

  describe('getIngredientById', () => {
    it('should fetch an ingredient by id', async () => {
      const mockIngredient = {
        id: '1',
        name: 'chicken',
        caloriesPer100: 200,
        carbsPer100: 0,
        fatPer100: 10,
        isVegetable: false,
        isCarbCounted: true,
      };
      mockedIngredientRepository.fetchIngredient.mockResolvedValue(mockIngredient);

      const result = await ingredientService.getIngredientById('1');

      expect(result).toEqual(mockIngredient);
      expect(mockedIngredientRepository.fetchIngredient).toHaveBeenCalledWith('1');
    });

    it('should throw error when ingredient not found', async () => {
      mockedIngredientRepository.fetchIngredient.mockResolvedValue(null);

      await expect(ingredientService.getIngredientById('999')).rejects.toThrow('Ingredient not found');
    });
  });

  describe('createIngredient', () => {
    it('should create a new ingredient', async () => {
      const mockIngredient = {
        id: '1',
        name: 'chicken',
        caloriesPer100: 0,
        carbsPer100: 0,
        fatPer100: 0,
        isVegetable: false,
        isCarbCounted: true,
      };
      mockedIngredientRepository.insertIngredient.mockResolvedValue(mockIngredient);

      const result = await ingredientService.createIngredient('chicken');

      expect(result).toEqual(mockIngredient);
      expect(mockedIngredientRepository.insertIngredient).toHaveBeenCalledWith('chicken');
    });
  });

  describe('updateIngredientDetails', () => {
    it('should update ingredient details', async () => {
      const updateData = { caloriesPer100: 200, carbsPer100: 5, fatPer100: 10, isVegetable: false, isCarbCounted: true };
      mockedIngredientRepository.updateIngredient.mockResolvedValue(undefined);

      await ingredientService.updateIngredientDetails('1', updateData);

      expect(mockedIngredientRepository.updateIngredient).toHaveBeenCalledWith('1', updateData);
    });
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
