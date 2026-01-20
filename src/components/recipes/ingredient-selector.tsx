import * as elements from 'typed-html';
import { Ingredient } from '@prisma/client';
import { swapOobTag } from '../../utils/swap-oob-wrapper';
import { texts } from '../../constants/texts';

export class IngredientSelector {
  constructor(
    private recipeIngredientIds: string[],
    private ingredients: Ingredient[],
    private options: { swapOob?: HtmxSwapOobOption } = {},
  ) {}

  async render(): Promise<string> {
    const unusedIngredients = this.ingredients.filter(
      (ingredient) => !this.recipeIngredientIds.some((recipeIngredientId) => recipeIngredientId === ingredient.id),
    );

    const attrs: any = {
      id: 'ingredient-selector',
      class: 'flex justify-center',
    };
    const swapOobAttr = swapOobTag(this.options.swapOob);
    if (swapOobAttr) attrs['hx-swap-oob'] = swapOobAttr.replace('hx-swap-oob="', '').replace('"', '');

    const optionsHtml = unusedIngredients.map(({ id, name }) => `<option value="${id}">${name}</option>`).join('');

    return (
      <div {...attrs}>
        <select name="ingredientId" class="select select-bordered select-sm">
          <option disabled="true" selected="true">
            {texts.common.emptyOption}
          </option>
          {optionsHtml}
        </select>
      </div>
    ) as string;
  }
}
