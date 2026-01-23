import { IngredientDetails } from './ingredient-details';

describe('IngredientDetails', () => {
  const mockIngredient = {
    id: 'test-id',
    name: 'Test Ingredient',
    caloriesPer100: 200,
    carbsPer100: 50,
    fatPer100: 10,
    isVegetable: true,
    isCarbCounted: false,
  };

  describe('nutrient inputs', () => {
    it('should render calories input with value', () => {
      const details = new IngredientDetails(mockIngredient);
      const html = details.calories();

      expect(html).toContain('name="calories"');
      expect(html).toContain('value="200"');
      expect(html).toContain('/ingredient/test-id');
    });

    it('should render carbs input with value', () => {
      const details = new IngredientDetails(mockIngredient);
      const html = details.carbs();

      expect(html).toContain('name="carbs"');
      expect(html).toContain('value="50"');
      expect(html).toContain('/ingredient/test-id');
    });

    it('should render fat input with value', () => {
      const details = new IngredientDetails(mockIngredient);
      const html = details.fat();

      expect(html).toContain('name="fat"');
      expect(html).toContain('value="10"');
      expect(html).toContain('/ingredient/test-id');
    });
  });

  describe('render', () => {
    it('should render complete ingredient details', async () => {
      const details = new IngredientDetails(mockIngredient);
      const html = await details.render();

      expect(html).toContain('id="ingredient-details"');
      expect(html).toContain('name="calories"');
      expect(html).toContain('name="carbs"');
      expect(html).toContain('name="fat"');
      expect(html).toContain('name="isVegetable"');
      expect(html).toContain('name="isCarbCounted"');
    });
  });
});
