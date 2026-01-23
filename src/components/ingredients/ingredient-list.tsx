import * as elements from 'typed-html';
import { Ingredient } from '@prisma/client';
import { swapOobTag } from '../../utils/swap-oob-wrapper';
import { ingredientListItem } from './ingredient-list-item';

export const INGREDIENT_LIST_ID = 'ingredient-list';

export async function ingredientList(ingredients: Ingredient[], options: { swapOob?: HtmxSwapOobOption } = {}) {
  let ingredientComponents: string[] = [];
  for (const ingredient of ingredients) {
    ingredientComponents.push(await ingredientListItem(ingredient));
  }

  const divAttrs: any = {
    id: INGREDIENT_LIST_ID,
    class: 'grid grid-cols-max-6 grid-row-flex gap-2 items-center',
  };

  const swapOobAttr = swapOobTag(options.swapOob);
  if (swapOobAttr) {
    divAttrs['hx-swap-oob'] = 'outerHTML';
  }

  return (<div {...divAttrs}>{ingredientComponents.join('<div class="divider m-0 col-span-6"></div>')}</div>) as string;
}
