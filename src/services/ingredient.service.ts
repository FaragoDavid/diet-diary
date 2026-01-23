import * as ingredientRepository from '../repository/ingredient';

export async function removeIngredient(id: string, query?: string) {
  await ingredientRepository.deleteIngredient(id);

  let ingredients = await ingredientRepository.fetchIngredients(query);
  if (ingredients.length === 0) {
    ingredients = await ingredientRepository.fetchIngredients();
  }

  return ingredients;
}
