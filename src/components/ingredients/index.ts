import config from '../../config.js';

const ingredientValueInput = (placeholder: String, size: Number) => `
  <input type="text" id="ingredient-name" class="input input-bordered" placeholder=${placeholder}>
`;

const newIngredient = () => {
  return `
    <div class="flex justify-center space-x-4">
      ${Object.values(config.nutrients)
        .map((placeholder, _, values) => ingredientValueInput(placeholder, values.length + 1))
        .join('')}
      <div class="flex-none w-1/${Object.values(config.nutrients).length + 1}">
        <button class="btn btn-primary">${config.texts.buttons.add}</button>
      </div>
    </div>
  `;
};

export class Ingredients implements BaseComponent {
  public title = config.texts.titles.ingredients;

  async render() {
    return `
      ${newIngredient()}
    `;
  }
}
