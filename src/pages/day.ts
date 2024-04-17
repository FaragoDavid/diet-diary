import { BackLink } from '../components/back-link.js';
import { missingMealsPlaceholder } from '../components/meals/missing-meals.js';
import { dayHeader } from '../components/meals/day-header.js';

export class DayPage implements BaseComponent {
  async render() {
    return `
      <div id="day">
        ${await new BackLink().render()}
        <div class="container py-6">
           <div class="flex justify-center items-center">
            <div class="flex flex-col items-center gap-4">
              ${dayHeader('create')}
              ${missingMealsPlaceholder()}
              <div id="meals" class="grid grid-cols-max-5 gap-x-2 gap-y-4"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
