import { Ingredient } from '../../repository/ingredient.js';
import { RecipeWithIngredientName } from '../../repository/recipe.js';
import { stats } from '../stats.js';

export class RecipeDetails implements BaseComponent {
  recipeAmount: number;
  constructor(private recipe: RecipeWithIngredientName, private ingredients: Ingredient[]) {
    this.recipeAmount = this.recipe.amount || this.recipe.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
  }

  amount = () => `
    <div class="flex flex-col justify-center items-center gap-y-1">
      <div class="text text-center text-sm italic">Menny.</div>
      <div class="flex justify-center items-center">
        <input 
          type="number"
          name="amount"
          class="input input-sm input-bordered w-16 pr-5 text-right" 
          value="${this.recipeAmount}"
          hx-post="/recipe/${this.recipe.id}/amount"
          hx-target="#recipe"
          hx-swap="outerHTML"
        >
          <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
        </input>
      </div>
    </div>
  `;

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
      <div id="recipe-details" class="grid grid-rows-max-1 grid-flow-col gap-3">
        ${this.amount()}
        <div class="divider divider-horizontal" ></div> 
        ${await this.recipeStats()}
      </div>
    `;
  }
}
