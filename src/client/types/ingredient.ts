export interface Ingredient {
  id: string;
  name: string;
  caloriesPer100: number;
  carbsPer100: number;
  fatPer100: number;
  isVegetable: boolean;
  isCarbCounted: boolean;
  inStock: boolean;
}

export type NewIngredient = Omit<Ingredient, 'id'>;
export type IngredientUpdate = Partial<NewIngredient>;
