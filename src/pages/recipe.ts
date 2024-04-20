import { stats } from '../components/stats.js';
import { BackLink } from '../components/back-link.js';
import { RecipeIngredientList } from '../components/recipes/recipe-ingredient-list.js';
import { fetchIngredients } from '../repository/ingredient.js';
import { Recipe } from '../repository/recipe.js';

export class RecipePage implements BaseComponent {
  recipeAmount: number;
  constructor(private recipe: Recipe) {
    this.recipeAmount = this.recipe.amount || this.recipe.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
  }

  header = () => `<div class="text-center text-3xl font-medium">${this.recipe.name}</div>`;

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
    const ingredients = await fetchIngredients();

    const { recipeCalories, recipeCH, recipeFat } = this.recipe.ingredients.reduce(
      (acc, ingredient) => {
        const fullIngredient = ingredients.find(({ id }) => id === ingredient.id);

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
      {
        id: `recipe-${this.recipe.id}-stats`,
        orientation: 'vertical',
        size: 'lg',
      },
    )
  };

  async render() {
    return `
      <div id="recipe">
        ${await new BackLink().render()}
        <div class="container py-10 px-2 mx-auto ">
          <div class="flex flex-col place-items-center gap-y-4">
            ${this.header()}
            <div class="flex justify-center items-center">
              ${this.amount()}
              <div class="divider divider-horizontal" ></div> 
              ${await this.recipeStats()}
            </div>
            <div class="text text-center">
              Alapanyagok
            </div>
            ${await new RecipeIngredientList(this.recipe.id).render()}
          </div>
        </div>
      </div>
    `;
  }
}
