import repository, { RecipeWithIngredientName } from '../repository.js';
import { BackLink } from '../components/back-link.js';
import { RecipeIngredientList } from '../components/recipes/recipe-ingredient-list.js';

export class Recipe implements BaseComponent {
  private recipe?: RecipeWithIngredientName;
  private recipeAmount?: number;

  constructor(private id: string) {}

  header = () => `<div class="text-center text-3xl font-medium">${this.recipe!.name}</div>`;

  amount = () => `
    <div class="flex flex-col justify-center items-center gap-y-1">
      <div class="text text-center text-sm italic">Menny.</div>
      <div class="flex justify-center items-center">
        <input 
          type="number"
          name="amount"
          class="input input-sm input-bordered w-16 bg-base-200  pr-5 text-right" 
          value="${this.recipeAmount}"
          hx-post="/recipe/${this.id}/amount"
          hx-target="#recipe"
          hx-swap="outerHTML"
        >
          <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
        </input>
      </div>
    </div>
  `;

  recipeStats = async () => {
    const ingredients = await repository.fetchIngredients();
    
    const { recipeCalories, recipeCH, recipeFat } = this.recipe!.ingredients.reduce(
      (acc, ingredient) => {
        const fullIngredient = ingredients.find(({ id }) => id === ingredient.id);

        if (!fullIngredient) return acc;
        return {
          recipeCalories: acc.recipeCalories + fullIngredient.calories * ingredient.amount,
          recipeCH: acc.recipeCH + fullIngredient.CH * ingredient.amount,
          recipeFat: acc.recipeFat + fullIngredient.fat * ingredient.amount,
        };
      },
      { recipeCalories: 0, recipeCH: 0, recipeFat: 0 },
    );

    return `
    <div class="flex justify-center items-center">
      <div class="flex flex-col justify-center items-center gap-y-1">
        <div class="text text-center text-sm italic">Cal</div>
        <div class="text text-center text-lg">${Math.round(recipeCalories * this.recipeAmount! * 100) / 100}</div>
      </div>
      <div class="divider divider-horizontal" ></div> 
      <div class="flex flex-col justify-center items-center gap-y-1">
        <div class="text text-center text-sm italic">CH</div>
        <div class="text text-center text-lg">${Math.round(recipeCH * this.recipeAmount! * 100) / 100}</div>
      </div>
      <div class="divider divider-horizontal" ></div> 
      <div class="flex flex-col justify-center items-center gap-y-1">
        <div class="text text-center text-sm italic">Zsír</div>
        <div class="text text-center text-lg">${Math.round(recipeFat * this.recipeAmount! * 100) / 100}</div>
      </div>
    </div>
  `;
  };

  async render() {
    this.recipe = await repository.fetchRecipe(this.id);
    if (!this.recipe) return 'Recept nem található';
    this.recipeAmount = this.recipe!.amount || this.recipe!.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
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
            ${await new RecipeIngredientList(this.id).render()}
          </div>
        </div>
      </div>
    `;
  }
}
