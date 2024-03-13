import config from '../../config.js';

const ingredientValueInput = (placeholder: String, size: Number) => `
  <input type="text" id="ingredient-name" class="input input-bordered  flex-none w-1/${size}" placeholder=${placeholder}>
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
  async render() {
    return `
      <div tabindex="0" class="collapse collapse-arrow  bg-base-300">
        <div class="collapse-title text-center text-2xl font-medium">
          ${config.texts.titles.ingredients}
        </div>

        <div class="collapse-content">
          ${newIngredient()}
        </div>
      </div>
    `;
  }
}
