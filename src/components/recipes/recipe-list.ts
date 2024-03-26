import icons from '../../utils/icons.js';
import config from '../../config.js';
import repository, { RecipeType } from '../../repository.js';

const header = () => `
  <thead>
    <tr>
      ${Object.values(config.recipes.props)
        .map(({ name }) => `<th>${name}</th>`)
        .join('')}
      <th />
    </tr>
  </thead>
`;

const recipeStats = async (recipeId: string) => {
  const ingredients = await repository.fetchIngredients();
  const recipe = await repository.fetchRecipe(recipeId);
  if (!recipe) return '';

  const recipeAmount = recipe.amount || recipe.ingredients.reduce((amount, ingredient) => amount + ingredient.amount, 0);

  const { recipeCalories, recipeCH, recipeFat } = recipe.ingredients.reduce(
    (acc, ingredient) => {
      const { calories, CH, fat } = ingredients.find(({ id }) => id === ingredient.id) || { calories: 0, CH: 0, fat: 0 };
      return {
        recipeCalories: acc.recipeCalories + calories * ingredient.amount,
        recipeCH: acc.recipeCH + CH * ingredient.amount,
        recipeFat: acc.recipeFat + fat * ingredient.amount,
      };
    },
    { recipeCalories: 0, recipeCH: 0, recipeFat: 0 },
  );

  return `
    <div class="text text-sm italic">Cal: ${Math.round(recipeCalories *100) * recipeAmount / 100}</div>
    <div class="divider divider-horizontal" ></div> 
    <div class="text text-sm italic">CH: ${Math.round(recipeCH *100) * recipeAmount / 100}</div>
    <div class="divider divider-horizontal" ></div> 
    <div class="text text-sm italic">Zsír: ${Math.round(recipeFat *100) * recipeAmount / 100}</div>
  `;
};

const renderRecipes = async (recipes: RecipeType[]) => {
  let renderedRecipes = '';
  for (const recipe of recipes) {
    renderedRecipes += `
    <div class="text">${recipe.name}</div>
    <div class="flex items-center justify-center">
      <input 
        id="amount-${recipe.id}"
        type="number"
        class="input input-xs input-bordered max-w-16 bg-base-200  pr-5 text-right" 
        value="${recipe.amount ?? 0}"
        min="0" max="9999"
        hx-trigger="change"
        hx-target="#recipe-list"
        hx-post="/recipe/${recipe.id}/amount"
        hx-vals="js:{
          amount: document.getElementById('amount-${recipe.id}').value,
          query: document.getElementById('search-recipe').value
        }"
      >
        <span class="relative right-4 text-xs">g</span>
      </input>
    </div>
    <div class="flex items-center justify-center row-span-2">
      <a 
        href="/recipe/${recipe.id}" 
        class="btn btn-sm btn-primary"
      >${icons.edit}</a>
    </div>
    <div class="flex justify-center col-span-2 pb-3">
      ${await recipeStats(recipe.id)}
    </div>
    `;
  }
  return renderedRecipes;
};

const x = ``;

export class RecipeList implements BaseComponent {
  constructor(private query: string) {}

  async render() {
    const recipes = await repository.fetchRecipes(this.query);

    return `
      <div id="recipe-list" class="grid grid-cols-max-3 grid-row-flex gap-2 bg-base-100">
        ${await renderRecipes(recipes)}
      </div>
    `;
  }
}
