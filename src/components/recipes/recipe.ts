import icons from '../../utils/icons.js';
import config from '../../config.js';
import repository, { Dish, Ingredient } from '../../repository.js';
import { RecipeIngredientList } from './recipe-ingredient-list.js';

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

const renderIngredient = (ingredient: Dish) => `
  <tr id="recipe-ingredient-list">
    ${Object.entries(config.recipes.props)
      .map(([prop, { name, type }]) => ingredientPropInput(prop, name, type, ingredient[prop], ingredient.id))
      .join('')}    
    <td>
      <button 
        type="submit"
        class="btn btn-primary btn-sm"
      />
      ${icons.save}
    </td>
  </tr>
`;

const textHeader = (recipeName: string) => `
  <div class="text-center text-3xl font-medium">
    ${recipeName}
  </div>
`;

const inputHeader = () => `
  <input 
    type="text" 
    name="recipe-name" 
    class="input input-bordered" 
    placeholder="Recept neve"
  />
`;

export class Recipe implements BaseComponent {
  constructor(private id?: string) {}

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

    if(this.id && !recipe) return 'Recept nem található';

    const recipeIngrs = recipe?.ingredients || [];
    const ingredients = await repository.fetchIngredients();

    return `
      <div class="container py-6 px-2 mx-auto ">
        <div class="flex flex-col place-items-center gap-4">
          <div class="flex items-top w-full">
            <a href="/dashboard">
              <button type="submit" class="btn bg-base-100 border-0 btn-sm">${icons.back}</button>
            </a>
            <div class="flex-grow"></div>
            ${recipe ? textHeader(recipe.name) : inputHeader()}
            <div class="flex-grow"></div>
          </div>
          ...
          <div class="text text-center">
            Alapanyagok
          </div>
          ${this.id && (await new RecipeIngredientList(this.id).render())}
        </div>
      </div>
    `;
  }
}
