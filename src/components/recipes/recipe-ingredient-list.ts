import icons from '../../utils/icons.js';
import repository, { Ingredient, RecipeIngredientWithName } from '../../repository.js';

const ingredientName = (ingredient: RecipeIngredientWithName) => `
<div class="flex justify-center">
  <input 
    type="text" 
    name="${ingredient.id}" 
    class="input input-bordered input-sm max-w-32 sm:max-w-full"
    readonly disabled
    value="${ingredient.name}"
    placeholder="Alapanyag neve"
  />
</div>`;

const ingredientAmount = (ingredient: RecipeIngredientWithName) => `
<div class="flex justify-center">
  <input 
    type="number"
    name="${ingredient.id}" 
    class="input input-sm input-bordered max-w-16 bg-base-200  pr-5 text-right" 
    value="${ingredient.amount}"
    min="0" max="9999"
  >
    <span class="relative right-4 top-2 text-sm">g</span>
  </input>
</div>`;

const saveIngredient = (ingredient: RecipeIngredientWithName, id: string) => `
<div class="flex justify-center">
  <button 
    type="submit"
    class="btn btn-primary btn-sm"
    hx-post="/recipe/${id}/ingredient/${ingredient.id}"
    hx-target="#recipe-ingredient-list"
    hx-swap="outerHTML"
  />
  ${icons.save}
</div>`;

const ingredientStats = (ingredient: RecipeIngredientWithName, fullIngredient: Ingredient) => `
<div class="flex justify-center col-span-3 mb-4">
  <div class="text text-sm italic text-neutral-content">
    Cal: ${fullIngredient.calories * ingredient.amount}
  </div>
  <div class="divider divider-horizontal" ></div> 
  <div class="text text-sm italic text-neutral-content">
    CH: ${fullIngredient.CH * ingredient.amount}
  </div>
  <div class="divider divider-horizontal" ></div> 
  <div class="text text-sm italic text-neutral-content">
    Zsír: ${fullIngredient.fat * ingredient.amount}
  </div>
</div>`;

const ingredientSelector = (ingredients: Ingredient[]) => `
<div class="flex justify-center">
  <select name="newIngredient" class="select select-bordered select-sm max-w-32 sm:max-w-full">
    ${ingredients.map((ingredient) => `<option value="${ingredient.id}" >${ingredient.name}</option>`).join('')}
  </select>
</div>
`;

const newIngredientAmount = () => `
<div class="flex justify-center">
  <input 
    type="number" 
    name="newIngredient"
    class="input input-bordered input-sm read-only:bg-inherit placeholder-neutral max-w-32 sm:max-w-full" 
    placeholder="Mennyiség"
  />
</div>`;

const addIngredient = (id: string) => `
<div class="flex justify-center">
  <button  
    type="submit"
    class="btn btn-primary btn-sm"
    hx-post="/recipe/${id}"
    hx-target="#recipe-ingredient-list"
    hx-swap="outerHTML"
  >${icons.add}</button>
</div>`;

export class RecipeIngredientList implements BaseComponent {
  private ingredients: Ingredient[] = [];
  constructor(private id: string) {}

  renderIngredient = (ingredient: RecipeIngredientWithName) => {
    const fullIngredient = this.ingredients.find((ingr) => ingr.id === ingredient.id);
    if (!fullIngredient) return '';

    return `
      ${ingredientName(ingredient)}
      ${ingredientAmount(ingredient)}
      ${saveIngredient(ingredient, this.id)}
      ${ingredientStats(ingredient, fullIngredient)}
    `;
  };

  addIngredient = () => `
    ${ingredientSelector(this.ingredients)}
    ${newIngredientAmount()}
    ${addIngredient(this.id)}
  `;

  async render() {
    const recipe = await repository.fetchRecipe(this.id);
    if (!recipe) return 'Error: Recipe not found';

    const recipeIngrs = recipe.ingredients;
    this.ingredients = await repository.fetchIngredients();

    return `
      <form id="recipe-ingredient-list">
        <div class="grid grid-cols-max-3 grid-row-flex gap-2">
          <tbody>
            ${recipeIngrs.map((ingredient) => this.renderIngredient(ingredient)).join('')}
            ${this.addIngredient()}
          </tbody>
        </div>
      </form>
    `;
  }
}
