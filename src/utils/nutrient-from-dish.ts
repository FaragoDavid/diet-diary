import { Ingredient } from '../repository/ingredient.js';

export function nutrientFromDish(id: string, amount: number, nutrient: 'calories' | 'carbs' | 'fat', ingredients: Ingredient[]) {
  const ingredient = ingredients.find((ingr) => ingr.id === id);
  if (!ingredient) throw new Error('Ingredient not found');
  return (ingredient[nutrient] / 100) * amount;
}
