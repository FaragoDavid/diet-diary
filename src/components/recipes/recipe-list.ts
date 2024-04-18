import icons from '../../utils/icons.js';
import repository from '../../repository/ingredient.js';
import { RecipeType, fetchRecipe, fetchRecipes } from '../../repository/recipe.js';

const recipeStats = async (recipeId: string) => {
  const ingredients = await repository.fetchIngredients();
  const recipe = await fetchRecipe(recipeId);
  if (!recipe) return '';

  const recipeAmount = recipe.amount || recipe.ingredients.reduce((amount, ingredient) => amount + ingredient.amount, 0);

  const { recipeCalories, recipeCH, recipeFat } = recipe.ingredients.reduce(
    (acc, ingredient) => {
      const { calories, carbs, fat } = ingredients.find(({ id }) => id === ingredient.id) || { calories: 0, carbs: 0, fat: 0 };
      return {
        recipeCalories: acc.recipeCalories + calories * ingredient.amount,
        recipeCH: acc.recipeCH + carbs * ingredient.amount,
        recipeFat: acc.recipeFat + fat * ingredient.amount,
      };
    },
    { recipeCalories: 0, recipeCH: 0, recipeFat: 0 },
  );

  return `
    <div class="text text-sm italic">Kal: ${(Math.round(recipeCalories * 100) * recipeAmount) / 100}</div>
    <div class="divider divider-horizontal" ></div> 
    <div class="text text-sm italic">CH: ${(Math.round(recipeCH * 100) * recipeAmount) / 100}</div>
    <div class="divider divider-horizontal" ></div> 
    <div class="text text-sm italic">Zsír: ${(Math.round(recipeFat * 100) * recipeAmount) / 100}</div>
  `;
};

const recipeAmount = (recipe: RecipeType) => `
<div class="flex justify-center items-center">
  <input 
    id="amount-${recipe.id}"
    type="number"
    class="input input-xs input-bordered w-16  pr-5 text-right peer placeholder:text-neutral placeholder:text-xs" 
    ${recipe.amount ? `value="${recipe.amount}"` : ''}
    placeholder="0"
    hx-trigger="change"
    hx-target="#recipe-list"
    hx-post="/recipe/${recipe.id}"
    hx-vals="js:{
      amount: document.getElementById('amount-${recipe.id}').value,
      query: document.getElementById('search-recipe').value
    }"
  >
    <span class="relative right-4 text-xs peer-[:placeholder-shown]:text-neutral">g</span>
  </input>
</div>
`;

const renderRecipe = async (recipe: RecipeType) => `
<div class="text">${recipe.name}</div>
${recipeAmount(recipe)}
<div class="flex justify-center items-center row-span-2">
  <a 
    href="/recipe/${recipe.id}" 
    class="btn btn-sm btn-primary"
  >${icons.edit}</a>
</div>
<div class="flex justify-center col-span-2 pb-3">
  ${await recipeStats(recipe.id)}
</div>
`;

const renderRecipes = async (recipes: RecipeType[]) => {
  let renderedRecipes = '';
  for (const recipe of recipes) {
    renderedRecipes += await renderRecipe(recipe);
  }
  return renderedRecipes;
};

const x = ``;

export class RecipeList implements BaseComponent {
  constructor(private query: string) {}

  async render() {
    const recipes = await fetchRecipes(this.query);

    return `
      <div id="recipe-list" class="grid grid-cols-max-3 grid-row-flex gap-2 bg-base-100">
        ${await renderRecipes(recipes)}
      </div>
    `;
  }
}
