import { ingredientDetails } from './ingredient-details';

describe('ingredientDetails', () => {
  const mockIngredient = {
    id: 'test-id',
    name: 'Test Ingredient',
    caloriesPer100: 200,
    carbsPer100: 50,
    fatPer100: 10,
    isVegetable: true,
    isCarbCounted: false,
  };

  describe('render', () => {
    it('should render complete ingredient details', async () => {
      const html = await ingredientDetails(mockIngredient);

      expect(html).toContain('id="ingredient-details"');
      expect(html).toContain('name="calories"');
      expect(html).toContain('name="carbs"');
      expect(html).toContain('name="fat"');
      expect(html).toContain('name="isVegetable"');
      expect(html).toContain('name="isCarbCounted"');
    });
  });
});
