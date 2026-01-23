import { calculateIngredientNutrition } from './nutrition-calculator';

describe('calculateIngredientNutrition', () => {
  it('should calculate nutrition for ingredient with amount', () => {
    const ingredient = {
      id: 'test-id',
      name: 'Test Ingredient',
      caloriesPer100: 200,
      carbsPer100: 50,
      fatPer100: 10,
      isVegetable: false,
      isCarbCounted: true,
    };

    const result = calculateIngredientNutrition(ingredient, 150);

    expect(result).toEqual({
      calories: 300,
      carbs: 75,
      fat: 15,
    });
  });

  it('should handle null values as 0', () => {
    const ingredient = {
      id: 'test-id',
      name: 'Test Ingredient',
      caloriesPer100: null as any,
      carbsPer100: null as any,
      fatPer100: null as any,
      isVegetable: false,
      isCarbCounted: true,
    };

    const result = calculateIngredientNutrition(ingredient, 100);

    expect(result).toEqual({
      calories: 0,
      carbs: 0,
      fat: 0,
    });
  });
});
