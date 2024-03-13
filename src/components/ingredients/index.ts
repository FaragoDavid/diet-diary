import config from '../../config.js';

const ingredientValueInput = (placeholder: String, type: string, width: string) => `
  <input type="${type}" class="input input-bordered w-${width} placeholder:text-xs placeholder:sm:text-base" placeholder=${placeholder}>
`;

const newIngredient = () => {
  const width = `1/${Object.values(config.nutrients).length}`;
  return `
    <div class="flex items-center justify-center space-x-4 space-y-0">
      ${Object.values(config.nutrients)
        .map(({ placeholder, type }) => ingredientValueInput(placeholder, type, width))
        .join('')}
      <div class="flex-none">
        <button class="btn btn-primary sm:hidden">+</button>
        <button class="btn btn-primary hidden sm:block">${config.texts.buttons.add}</button>
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
