import * as elements from 'typed-html';
import { Ingredient } from '@prisma/client';
import { swapOobTag } from '../../utils/swap-oob-wrapper';
import { texts } from '../../constants/texts';

export async function ingredientSelector(
  recipeIngredientIds: string[],
  ingredients: Ingredient[],
  options: { swapOob?: HtmxSwapOobOption } = {},
) {
  const unusedIngredients = ingredients.filter(
    (ingredient) => !recipeIngredientIds.some((recipeIngredientId) => recipeIngredientId === ingredient.id),
  );

  const attrs: any = {
    id: 'ingredient-selector',
    class: 'flex justify-center',
  };
  const swapOobAttr = swapOobTag(options.swapOob);
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
