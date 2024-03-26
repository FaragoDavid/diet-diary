import icons from '../../utils/icons.js';
import config from '../../config.js';
import repository, { Dish, Ingredient } from '../../repository.js';

const ingredientPropInput = (prop: string, name: string, type: string, value: number | string = '', ingredientId: string) => `
  <td class="max-w-1/2">
    <input 
      name="${ingredientId}"
      type="${type}" 
      ${prop === 'name' && value ? 'disabled readonly' : ''}
      value="${value}"
      class="input input-bordered input-sm w-full read-only:bg-inherit placeholder-neutral" 
      placeholder="${name}"
    />
  </td>
`;

export class RecipeIngredientList implements BaseComponent {
  constructor(private id: string) {}

  renderIngredient = (ingredient: Dish) => `
    <tr">
      ${Object.entries(config.recipes.props)
        .map(([prop, { name, type }]) => ingredientPropInput(prop, name, type, ingredient[prop], ingredient.id))
        .join('')}    
      <td>
        <button 
          type="submit"
          class="btn btn-primary btn-sm"
          hx-post="/recipe/${this.id}/ingredient/${ingredient.id}"
          hx-target="#recipe-ingredient-list"
          hx-swap="outerHTML"
        />
        ${icons.save}
      </td>
    </tr>
  `;

  addIngredient = (ingredients: Ingredient[]) => `
    <tr>
      <td class="max-w-1/2">
        <select name="newIngredient" class="select select-bordered select-sm w-full max-w-xs">
          ${ingredients.map((ingredient) => `<option value="${ingredient.id}" >${ingredient.name}</option>`).join('')}
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
    if (!recipe) return 'Error: Recipe not found';

    const recipeIngrs = recipe.ingredients;
    const ingredients = await repository.fetchIngredients();

    return `
      <form id="recipe-ingredient-list" class="overflow-x-auto w-full">
        <table class="table table-zebra table-pin-rows">
          <tbody>
            ${recipeIngrs.map((ingredient) => this.renderIngredient(ingredient)).join('')}
            ${this.addIngredient(ingredients)}
          </tbody>
        </table>
      </form>
    `;
  }
}
