export const CARB_LIMIT_NOT_APPLICABLE = null;

export interface Ingredient {
  id: string;
  name: string;
  caloriesPer100: number;
  carbsPer100: number;
  fatPer100: number;
  isVegetable: boolean;
  carbLimit: number | null;
}

export type NewIngredient = Omit<Ingredient, 'id'>;
export type IngredientUpdate = Partial<NewIngredient>;
