import repository, { Ingredient } from '../../repository.js';
import icons from '../../utils/icons.js';
import { BackLink } from '../back-link.js';
import { RecipeIngredientList } from './recipe-ingredient-list.js';

const header = (recipeName: string) => `
  <div class="text-center text-3xl font-medium">
    ${recipeName}
  </div>
`;

const recipeStats = async (recipeId: string) => {
  const recipe = await repository.fetchRecipe(recipeId);
  const ingredients = await repository.fetchIngredients();

  const recipeCalories = recipe!.ingredients.reduce((cals, ingredient) => {
    const fullIngredient = ingredients.find(({ id }) => id === ingredient.id);
    return cals + (fullIngredient?.calories ?? 0) * ingredient.amount;
  }, 0);
  const recipeCH = recipe!.ingredients.reduce((ch, ingredient) => {
    const fullIngredient = ingredients.find(({ id }) => id === ingredient.id);
    return ch + (fullIngredient?.CH ?? 0) * ingredient.amount;
  }, 0);
  const recipeFat = recipe!.ingredients.reduce((fat, ingredient) => {
    const fullIngredient = ingredients.find(({ id }) => id === ingredient.id);
    return fat + (fullIngredient?.fat ?? 0) * ingredient.amount;
  }, 0);

  return `
    <div class="flex justify-center">
      <div class="text">Cal: ${recipeCalories}</div>
      <div class="divider divider-horizontal" ></div> 
      <div class="text">CH: ${recipeCH}</div>
      <div class="divider divider-horizontal" ></div> 
      <div class="text">Zsír: ${recipeFat}</div>
    </div>
  `;
};

export class EditRecipe implements BaseComponent {
  constructor(private id: string) {}

  addIngredient = (ingredients: Ingredient[]) => `
    <tr>
      <td>
        <select name="newIngredient" class="select select-bordered select-sm >
          ${ingredients.map((ingredient) => `<option>${ingredient.name}</option>`).join('')}
        </select>
      </td>
      <td>
        <input 
          type="number" 
          name="newIngredient"
          class="input input-bordered input-sm read-only:bg-inherit placeholder-neutral" 
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
      <div class="container py-10 px-2 mx-auto ">
        <div class="flex flex-col place-items-center gap-4">
          ${header(recipe.name)}
          ${await recipeStats(this.id)}
          <div class="text text-center">
            Alapanyagok
          </div>
          ${await new RecipeIngredientList(this.id).render()}
        </div>
      </div>
    `;
  }
}
