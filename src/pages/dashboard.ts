import { Ingredients } from '../components/ingredients/index.js';
import { DaySearch } from '../components/meals/day-search.js';
import { Recipes } from '../components/recipes/index.js';
import { Segment } from '../components/segment.js';
import config from '../config.js';
import { Ingredient } from '../repository/ingredient.js';

export class Dashboard implements BaseComponent {
  constructor(private ingredients: Ingredient[]) {}

  async render() {
    return `
      <div class="container p-2 mx-auto">
        <div class="flex flex-col place-items-center gap-4">
          <div class="text-center text-3xl font-medium py-2">
            ${config.texts.titles.page}
          </div>
          ${await new Segment(new Ingredients()).render()} 
          ${await new Segment(new Recipes()).render()} 
          ${await new Segment(new DaySearch(this.ingredients)).render()} 
        </div>
      </div>
    `;
  }
}
