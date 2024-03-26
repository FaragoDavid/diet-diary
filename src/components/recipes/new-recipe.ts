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
    <select name="ingredient" class="select select-bordered select-sm w-full max-w-xs">
      ${ingredients.map((ingredient) => `<option value="${ingredient.id}">${ingredient.name}</option>`).join('')}
    </select>
    <input 
      type="number" 
      name="amount"
      class="input input-bordered input-sm w-full read-only:bg-inherit placeholder-neutral" 
      placeholder="Mennyiség"
    />
    <button 
      type="submit"
      class="btn btn-primary btn-sm"
      hx-post="/new-recipe"
      hx-target="#new-recipe"
      hx-swap="outerHTML"
    >${icons.add}</button>
  `;

  async render() {
    const ingredients = await repository.fetchIngredients();

    return `
      <div id="new-recipe">
        ${await new BackLink().render()}
        <div class="container py-6 px-2 mx-auto ">
          <div class="flex flex-col place-items-center gap-4">
            ${header()}
            ...
            <form class="overflow-x-auto w-full">
              <div class="grid grid-cols-max-3 gap-4">
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
