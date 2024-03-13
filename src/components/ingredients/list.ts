import repository, { Ingredient } from '../../repository.js';
import config from '../../config.js';

const header = () => `
  <thead>
    <tr>
      ${config.tableHeaders.ingredients.map((header) => `<th>${header}</th>`).join('')}
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
    <div class="overflow-x-auto">
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
