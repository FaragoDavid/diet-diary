import icons from '../../utils/icons.js';
import repository, { Ingredient } from '../../repository.js';
import { BackLink } from '../back-link.js';

const header = () => `
  <div class="flex items-center justify-center">
    <div class="text-center text-3xl font-medium">
      Új recept
    </div>
  </div>
`;

const recipeName = () => `
  <div class="col-span-3 flex justify-center">
    <input 
      type="text" 
      name="name" 
      class="input input-bordered max-w-md"
      placeholder="Recept neve"
    />
  </div>
  <div class="col-span-3 flex justify-center">
    <div class="text text-center max-w-md">
      Alapanyagok
    </div>
  </div>
`;

export class NewRecipe implements BaseComponent {
  constructor() {}

  addIngredient = (ingredients: Ingredient[]) => `
    <div class="flex justify-center">
      <select name="ingredient" class="select select-bordered select-sm max-w-32 sm:max-w-full">
      ${ingredients.map((ingredient) => `<option value="${ingredient.id}">${ingredient.name}</option>`).join('')}
      </select>
    </div>
    <div class="flex justify-center">
      <input 
      type="number" 
      name="amount"
      class="input input-bordered input-sm placeholder-neutral max-w-32 sm:max-w-full"
      placeholder="Mennyiség"
      />
    </div>
    <div class="flex justify-center">
      <button 
      type="submit"
      class="btn btn-primary btn-sm"
      hx-post="/new-recipe"
      hx-target="#new-recipe"
      hx-swap="outerHTML"
      >${icons.add}</button>
    </div>
  `;

  async render() {
    const ingredients = await repository.fetchIngredients();

    return `
      <div id="new-recipe" class="w-full">
        ${await new BackLink().render()}
        <div class="container py-6 px-2 mx-auto ">
          <div class="flex flex-col items-center gap-4">
            ${header()}
            <form class="w-full flex justify-center">
              <div class="grid grid-cols-max-3 gap-x-2 gap-y-4">
                ${recipeName()}
                ${this.addIngredient(ingredients)}
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }
}
