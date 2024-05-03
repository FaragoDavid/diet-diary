import { Ingredient } from '../../repository/ingredient.js';
import { Recipe } from '../../repository/recipe.js';
import { stats } from '../stats.js';

export class RecipeStats implements BaseComponent {
  id: string;
  swapOob: HtmxSwapOobOption;
  constructor(private recipe: Recipe, private ingredients: Ingredient[], options: { id: string; swapOob: HtmxSwapOobOption }) {
    this.id = options.id;
    this.swapOob = options.swapOob;
  }

  async render() {
    const { recipeCalories, recipeCH, recipeFat } = this.recipe.ingredients.reduce(
      (acc, recipeIngredient) => {
        const { calories, carbs, fat } = this.ingredients.find(({ id }) => id === recipeIngredient.id) || { calories: 0, carbs: 0, fat: 0 };
        return {
          recipeCalories: acc.recipeCalories + calories * recipeIngredient.amount,
          recipeCH: acc.recipeCH + carbs * recipeIngredient.amount,
          recipeFat: acc.recipeFat + fat * recipeIngredient.amount,
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
