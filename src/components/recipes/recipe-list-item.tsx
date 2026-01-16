import * as elements from 'typed-html';
import { Ingredient } from '@prisma/client';
import { RecipeWithIngredients } from '../../repository/recipe';
import icons from '../../utils/icons';
import { amount as amountInput } from '../amount';
import { RecipeStats } from './recipe-stats';
import { RECIPE_SEARCH_ID } from './recipe-tab';

export class RecipeListItem implements BaseComponent {
  constructor(private recipe: RecipeWithIngredients, private ingredients: Ingredient[]) {}

  name(): string {
    return (<div class="text">{this.recipe.name}</div>) as string;
  }

  amount(): string {
    return amountInput({
      amount: this.recipe.amount || 0,
      name: 'amount',
      showText: false,
      hx: { verb: 'post', url: `/recipe/${this.recipe.id}/amount` },
    });
  }

  editButton(): string {
    const link = (<a href={`/recipe/${this.recipe.id}`} class="btn btn-sm btn-secondary" />) as string;

    return (<div class="flex justify-center items-center row-span-2">{link.replace('/>', `>${icons.edit}</a>`)}</div>) as string;
  }

  deleteButton(): string {
    const button = (
      <div
        class="btn btn-sm"
        hx-delete={`/recipe/${this.recipe.id}`}
        hx-target="this"
        hx-swap="outerHTML"
        hx-vals={`js:{query: document.getElementById('${RECIPE_SEARCH_ID}').value}`}
      />
    ) as string;

    return (<div class="flex justify-center items-center row-span-2">{button.replace('/>', `>${icons.delete}</div>`)}</div>) as string;
  }

  async render(): Promise<string> {
    const statsHtml = await new RecipeStats(this.recipe, {
      id: `recipe-${this.recipe.id}-stats`,
      layout: 'horizontal',
      size: 'sm',
      span: 'col-span-2',
      swapOob: false,
    }).render();

    return `
      ${this.name()}
      ${this.amount()}
      ${this.editButton()}
      ${this.deleteButton()}
      ${statsHtml}
    `;
  }
}
