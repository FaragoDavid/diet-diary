import repository, { Ingredient } from '../../repository.js';
import icons from '../../utils/icons.js';
import { BackLink } from '../back-link.js';
import { RecipeIngredientList } from './recipe-ingredient-list.js';

const header = (recipeName: string) => `
  <div class="text-center text-3xl font-medium">
    ${recipeName}
  </div>
`;

export class EditRecipe implements BaseComponent {
  constructor(private id: string) {}

  addIngredient = (ingredients: Ingredient[]) => `
    <tr>
      <td class="max-w-1/2">
        <select name="newIngredient" class="select select-bordered select-sm w-full max-w-xs">
          ${ingredients.map((ingredient) => `<option>${ingredient.name}</option>`).join('')}
        </select>
      </td>
      <td class="max-w-1/2">
        <input 
          type="number" 
          name="newIngredient"
          class="input input-bordered input-sm w-full read-only:bg-inherit placeholder-neutral" 
          placeholder="Mennyiség"
        />
      </td>
      <td>
        <button 
          type="submit"
          class="btn btn-primary btn-sm"
          hx-post="/recipe/${this.id}"
          hx-target="#recipe-ingredient-list"
          hx-swap="outerHTML"
        >${icons.add}</button>
      </td>
    </tr>
  `;

  async render() {
    const recipe = await repository.fetchRecipe(this.id);

    if (!recipe) return 'Recept nem található';

    return `
      ${await new BackLink().render()}
      <div class="container py-6 px-2 mx-auto ">
        <div class="flex flex-col place-items-center gap-4">
          <div class="flex items-top w-full">
            <div class="flex-grow"></div>
            ${header(recipe.name)}
            <div class="flex-grow"></div>
          </div>
          ...
          <div class="text text-center">
            Alapanyagok
          </div>
          ${await new RecipeIngredientList(this.id).render()}
        </div>
      </div>
    `;
  }
}
