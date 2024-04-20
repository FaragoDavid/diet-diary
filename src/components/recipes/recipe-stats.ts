import { Ingredient } from '../../repository/ingredient.js';
import { Recipe } from '../../repository/recipe.js';

export class RecipeStats implements BaseComponent {
  constructor(private recipe: Recipe, private ingredients: Ingredient[]) {}

  async render() {
    const recipeAmount = this.recipe.amount || this.recipe.ingredients.reduce((amount, ingredient) => amount + ingredient.amount, 0);

    const { recipeCalories, recipeCH, recipeFat } = this.recipe.ingredients.reduce(
      (acc, ingredient) => {
        const { calories, carbs, fat } = this.ingredients.find(({ id }) => id === ingredient.id) || { calories: 0, carbs: 0, fat: 0 };
        return {
          recipeCalories: acc.recipeCalories + calories * ingredient.amount,
          recipeCH: acc.recipeCH + carbs * ingredient.amount,
          recipeFat: acc.recipeFat + fat * ingredient.amount,
        };
      },
      { recipeCalories: 0, recipeCH: 0, recipeFat: 0 },
    );

    return `
      <div class="flex justify-center col-span-2 pb-3">
        <div class="text text-sm italic">Kal: ${(Math.round(recipeCalories * 100) * recipeAmount) / 100}</div>
        <div class="divider divider-horizontal" ></div> 
        <div class="text text-sm italic">CH: ${(Math.round(recipeCH * 100) * recipeAmount) / 100}</div>
        <div class="divider divider-horizontal" ></div> 
        <div class="text text-sm italic">Zsír: ${(Math.round(recipeFat * 100) * recipeAmount) / 100}</div>
      </div>
   `;
  }
}
