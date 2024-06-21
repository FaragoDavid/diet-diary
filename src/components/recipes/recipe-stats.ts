import { RecipeWithIngredients } from '../../repository/recipe.js';
import { StatsOptions, stats } from '../stats.js';

export class RecipeStats implements BaseComponent {
  constructor(private recipe: RecipeWithIngredients, private options: StatsOptions) {}

  async render() {
    const { recipeCalories, recipeCH, recipeFat } = this.recipe.ingredients.reduce(
      (acc, { amount, ingredient }) => {
        return {
          recipeCalories: acc.recipeCalories + ((ingredient.caloriesPer100 || 0) / 100) * amount,
          recipeCH: acc.recipeCH + ((ingredient.carbsPer100 || 0) / 100) * amount,
          recipeFat: acc.recipeFat + ((ingredient.fatPer100 || 0) / 100) * amount,
        };
      },
      { recipeCalories: 0, recipeCH: 0, recipeFat: 0 },
    );

    return stats({ cal: recipeCalories, carbs: recipeCH, fat: recipeFat }, this.options);
  }
}
