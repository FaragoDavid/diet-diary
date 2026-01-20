import { Ingredient } from '@prisma/client';
import * as ingredientRepository from '../repository/ingredient';

export class IngredientService {
  async getAllIngredients(query?: string) {
    return ingredientRepository.fetchIngredients(query);
  }

  async getIngredientById(id: string) {
    const ingredient = await ingredientRepository.fetchIngredient(id);
    if (!ingredient) {
      throw new Error('Ingredient not found');
    }
    return ingredient;
  }

  async createIngredient(name: string) {
    return ingredientRepository.insertIngredient(name);
  }

  async updateIngredientDetails(
    id: string,
    data: {
      caloriesPer100?: number;
      carbsPer100?: number;
      fatPer100?: number;
      isVegetable: boolean;
      isCarbCounted: boolean;
    },
  ) {
    return ingredientRepository.updateIngredient(id, data);
  }

  async removeIngredient(id: string, query?: string) {
    await ingredientRepository.deleteIngredient(id);

    let ingredients = await ingredientRepository.fetchIngredients(query);
    if (ingredients.length === 0) {
      ingredients = await ingredientRepository.fetchIngredients();
    }

    return ingredients;
  }
}

export const ingredientService = new IngredientService();
