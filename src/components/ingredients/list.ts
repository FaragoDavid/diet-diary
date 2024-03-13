import repository, { Ingredient } from '../../repository.js';
import config from '../../config.js';

const header = () => `
  <thead>
    <tr>
      ${Object.values(config.ingredients.props).map(({ name }) => `<th>${name}</th>`).join('')}
    </tr>
  </thead>
`;

const ingredient = (ingredient: Ingredient) => `
  <tr>
    <td>${ingredient.name}</td>
    <td>${ingredient.calories}</td>
    <td>${ingredient.CH}</td>
  </tr> 
`;

export class IngredientList implements BaseComponent {
  constructor(private query: string) {}

  async render() {
    const ingredients = await repository.fetchIngredients(this.query);

    return `
      <div id="ingredient-list" class="overflow-x-auto w-full">
        <table class="table table-zebra table-pin-rows">
          ${header()}
          <tbody>
            ${ingredients.map(ingredient).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}
