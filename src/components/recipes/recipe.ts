import icons from '../../utils/icons.js';
import repository from '../../repository.js';

const ingredientAmountInput = (amount?: number) => `
  <input 
    type="number" 
    name="amount" 
    value="${amount}"
    class="input input-bordered input-sm mw-1/2" placeholder="Mennyiség"
  />
`;
const ingredientNameInput = () => `
  <input 
    type="text" 
    name="amount" 
    class="input input-bordered input-sm w-full" 
    placeholder="Név"
  />
`;

const ingredient = (name: string, amount: number) => `
  <tr>
    <td class="max-w-1/2">
      <div name="name" class="text">
        ${name}
      </div>
    </td>
    <td class="max-w-1/2">${ingredientAmountInput(amount)}</td>
    <td>
      <button 
        type="submit"
        class="btn btn-primary btn-sm"
      />
      ${icons.edit}
    </td>
  </tr>
`;

const addIngredient = () => `
  <tr>
    <td class="max-w-1/2">
      ${ingredientNameInput()}
    </td>
    <td class="max-w-1/2">
      ${ingredientAmountInput()}
    </td>
    <td>
      <button 
        type="submit"
        class="btn btn-primary btn-sm w-full"
      >${icons.add}</button>
    </td>
  </tr>
`;

const textHeader = (recipeName: string) => `
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-semibold">${recipeName}</h2>
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

  async render() {
    const recipe = await repository.fetchRecipe(this.id);
    if (!recipe) return `<div>Recept nem található</div>`;
    const ingredients = recipe.ingredients;

    console.log('id', this.id);

    return `
      <div class="container py-6 px-2 mx-auto ">
        <div class="flex flex-col place-items-center gap-4">
          ${this.id ? textHeader(recipe.name) : inputHeader()}
          ...
          <div class="text text-center">
            Alapanyagok
          </div>

          <form>
            <div class="overflow-x-auto w-full bg-base-300">
              <table class="table table-zebra">
                <tbody>
                  ${ingredients.map(({ name, amount }) => ingredient(name, amount)).join('')}
                  ${addIngredient()}
                </tbody>
              </table>
            </div>
          </form>
        </div>
      </div>
    `;
  }
}
