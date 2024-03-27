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
<div class="flex justify-center items-center">
  <input 
    type="number"
    name="${ingredient.id}" 
    class="input input-sm input-bordered w-16 bg-base-200  pr-5 text-right" 
    value="${ingredient.amount}"
  >
    <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
  </input>
</div>`;

const saveIngredient = (ingredient: RecipeIngredientWithName, id: string) => `
<div class="flex justify-center items-center row-span-2">
  <button 
    type="submit"
    class="btn btn-primary btn-sm"
    hx-post="/recipe/${id}/ingredient/${ingredient.id}"
    hx-target="#recipe"
    hx-swap="outerHTML"
  />
  ${icons.save}
</div>`;

const ingredientStats = (ingredient: RecipeIngredientWithName, fullIngredient: Ingredient) => {
  return `
  <div class="flex justify-center col-span-2">
    <div class="text text-sm italic text-neutral-content">
      Cal: ${Math.round(fullIngredient.calories * ingredient.amount * 100) / 100}
    </div>
    <div class="divider divider-horizontal" ></div> 
    <div class="text text-sm italic text-neutral-content">
      CH: ${Math.round(fullIngredient.CH * ingredient.amount * 100) / 100}
    </div>
    <div class="divider divider-horizontal" ></div> 
    <div class="text text-sm italic text-neutral-content">
      Zsír: ${Math.round(fullIngredient.fat * ingredient.amount * 100) / 100}
    </div>
  </div>`;
};

const ingredientSelector = (ingredients: Ingredient[]) => `
<div class="flex justify-center">
  <select name="newIngredient" class="select select-bordered select-sm max-w-32 sm:max-w-full">
    ${ingredients.map((ingredient) => `<option value="${ingredient.id}" >${ingredient.name}</option>`).join('')}
  </select>
</div>
`;

const newIngredientAmount = () => `
<div class="flex justify-center items-center">
  <input 
    type="number"
    name="newIngredient"
    class="input input-sm input-bordered w-16 bg-base-200  pr-5 text-right placeholder:text-neutral peer" 
    placeholder="0"
  >
    <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
  </input>
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
      <div class="divider col-span-3 my-0" ></div>
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
      <form id="recipe-ingredient-list" class="grid grid-cols-max-3 grid-row-flex gap-2">
        ${recipeIngrs.map((ingredient) => this.renderIngredient(ingredient)).join('')}
        ${this.addIngredient()}
      </form>
    `;
  }
}
