import { RecipeWithIngredients } from '../../repository/recipe.js';
import { stats } from '../stats.js';

export class RecipeStats implements BaseComponent {
  id: string;
  swapOob: HtmxSwapOobOption;
  constructor(private recipe: RecipeWithIngredients, options: { id: string; swapOob: HtmxSwapOobOption }) {
    this.id = options.id;
    this.swapOob = options.swapOob;
  }

  async render() {
    const { recipeCalories, recipeCH, recipeFat } = this.recipe.ingredients.reduce(
      (acc, { amount, ingredient }) => {
        return {
          recipeCalories: acc.recipeCalories + (ingredient.caloriesPer100 || 0) * amount,
          recipeCH: acc.recipeCH + (ingredient.carbsPer100 || 0) * amount,
          recipeFat: acc.recipeFat + (ingredient.fatPer100 || 0) * amount,
        };
      },
      { recipeCalories: 0, recipeCH: 0, recipeFat: 0 },
    );

    return stats(
      { cal: recipeCalories, carbs: recipeCH, fat: recipeFat },
      { id: `recipe${this.recipe.id}-stats`, layout: 'horizontal', size: 'sm', span: 'col-span-2', swapOob: this.swapOob },
    );
  }
}
