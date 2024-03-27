import repository, { RecipeWithIngredientName } from '../../repository.js';
import { BackLink } from '../back-link.js';
import { RecipeIngredientList } from './recipe-ingredient-list.js';

const header = (recipeName: string) => `
  <div class="text-center text-3xl font-medium">
    ${recipeName}
  </div>
`;

const recipeStats = async (recipeId: string) => {
  const ingredients = await repository.fetchIngredients();
  const recipe = await repository.fetchRecipe(recipeId);
  if (!recipe) return '';

  const recipeAmount = recipe.amount || recipe.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);
  const { recipeCalories, recipeCH, recipeFat } = recipe.ingredients.reduce(
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
        <div class="text text-center text-lg">${Math.round(recipeCalories * recipeAmount * 100) / 100}</div>
      </div>
      <div class="divider divider-horizontal" ></div> 
      <div class="flex flex-col justify-center items-center gap-y-1">
        <div class="text text-center text-sm italic">CH</div>
        <div class="text text-center text-lg">${Math.round(recipeCH * recipeAmount * 100) / 100}</div>
      </div>
      <div class="divider divider-horizontal" ></div> 
      <div class="flex flex-col justify-center items-center gap-y-1">
        <div class="text text-center text-sm italic">Zsír</div>
        <div class="text text-center text-lg">${Math.round(recipeFat * recipeAmount * 100) / 100}</div>
      </div>
    </div>
  `;
};

const recipeAmount = (recipe: RecipeWithIngredientName) => {
  const recipeAmount = recipe.amount || recipe.ingredients.reduce((acc, ingredient) => acc + ingredient.amount, 0);

  return `
    <div class="flex flex-col justify-center items-center gap-y-1">
      <div class="text text-center">Menny.</div>
      <div class="flex justify-center items-center">
        <input 
          type="number"
          class="input input-sm input-bordered w-16 bg-base-200  pr-5 text-right" 
          value="${recipeAmount}"
        >
          <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
        </input>
      </div>
    </div>
  `;
};

export class EditRecipe implements BaseComponent {
  constructor(private id: string) {}

  async render() {
    const recipe = await repository.fetchRecipe(this.id);
    if (!recipe) return 'Recept nem található';

    return `
      ${await new BackLink().render()}
      <div class="container py-10 px-2 mx-auto ">
        <div class="flex flex-col place-items-center gap-y-4">
          ${header(recipe.name)}
          <div class="flex justify-center items-center">
            ${recipeAmount(recipe)}
            <div class="divider divider-horizontal" ></div> 
            ${await recipeStats(this.id)}
          </div>
          <div class="text text-center">
            Alapanyagok
          </div>
          ${await new RecipeIngredientList(this.id).render()}
        </div>
      </div>
    `;
  }
}
