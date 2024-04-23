import { Ingredient } from '../../repository/ingredient.js';
import { RecipeWithIngredientName } from '../../repository/recipe.js';
import { amount } from '../amount.js';
import { stats } from '../stats.js';

export class RecipeDetails implements BaseComponent {
  recipeAmount: number;
  swap: boolean;
  constructor(private recipe: RecipeWithIngredientName, private ingredients: Ingredient[], options: { swap: boolean }) {
    this.recipeAmount = this.recipe.amount || this.recipe.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
    this.swap = options.swap;
  }

  recipeStats = async () => {
    const { recipeCalories, recipeCH, recipeFat } = this.recipe.ingredients.reduce(
      (acc, ingredient) => {
        const fullIngredient = this.ingredients.find(({ id }) => id === ingredient.id);
        if (!fullIngredient) return acc;

        return {
          recipeCalories: acc.recipeCalories + fullIngredient.calories * ingredient.amount,
          recipeCH: acc.recipeCH + fullIngredient.carbs * ingredient.amount,
          recipeFat: acc.recipeFat + fullIngredient.fat * ingredient.amount,
        };
      },
      { recipeCalories: 0, recipeCH: 0, recipeFat: 0 },
    );

    return stats(
      { cal: recipeCalories, carbs: recipeCH, fat: recipeFat },
      { id: `recipe-${this.recipe.id}-stats`, orientation: 'vertical', size: 'lg' },
    );
  };

  async render() {
    return `
      <div 
        id="recipe-details" 
        class="grid grid-rows-max-1 grid-flow-col gap-3"
        ${this.swap ? 'hx-swap-oob="true"' : ''}
      >
        ${amount({
          amount: this.recipeAmount,
          name: 'amount',
          showText: true,
          hx: {
            verb: 'post',
            url: `/recipe/${this.recipe.id}/amount`,
          },
        })}
        <div class="divider divider-horizontal" ></div> 
        ${await this.recipeStats()}
      </div>
    `;
  }
}
