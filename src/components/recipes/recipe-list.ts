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

const recipe = (recipe: RecipeType) => `
  <tr>
    <td>${recipe.name}</td>
    <td>
      <a href="/recipe/${recipe.id}" class="btn btn-sm btn-primary">${icons.edit}</a>
    </td>
  </tr> 
`;

export class RecipeList implements BaseComponent {
  constructor(private query: string) {}

  async render() {
    const recipes = await repository.fetchRecipes(this.query);

    return `
      <div id="recipe-list" class="overflow-x-auto w-full">
        <table class="table table-zebra table-pin-rows">
          ${header()}
          <tbody>
            ${recipes.map(recipe).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
