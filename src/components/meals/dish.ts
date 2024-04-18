import { Dish } from "../../repository/meal.js";

export class DishComponent implements BaseComponent {
  constructor(private dish: Dish) {}

  dishAmount({ amount, name }: { amount?: number; name?: string }) {
    return `
    <div class="flex justify-center items-center">
      <input 
        type="number"
        ${name ? `name="${name}"` : ''}
        ${amount ? `value="${amount}"` : ''}
        class="input input-sm input-bordered w-[4.5rem] bg-white pr-5 text-right placeholder:text-neutral peer" 
        placeholder="0"
      >
        <span class="relative right-4 text-sm peer-[:placeholder-shown]:text-neutral">g</span>
      </input>
    </div>`;
  }

  async render() {
    const { name, amount, calories, carbs, fat } = this.dish;

    return `
      <div class="text">${name}</div>
      ${this.dishAmount({ amount })}
      <div class="text text-right">${Math.floor(calories)}</div>
      <div class="text text-right">${Math.floor(carbs)}</div>
      <div class="text text-right">${Math.floor(fat)}</div>
    `;
  }
}
