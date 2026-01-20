import * as elements from 'typed-html';
import { HTMX_SWAP } from '../utils/htmx';
import { swapOobTag } from '../utils/swap-oob-wrapper';
import { texts } from '../constants/texts';

export const enum TAB_NAME {
  ingredients = 'ingredients',
  recipes = 'recipes',
  meals = 'meals',
}

export const TAB_CONTAINER_ID = 'tab-container';
const TAB_LIST_ID = 'tab-list';

function tab(label: string, isActive: boolean, href: string): string {
  return (
    <a
      role="tab"
      class={`tab ${isActive ? 'tab-active' : ''}`}
      hx-get={href}
      hx-target={`#${TAB_CONTAINER_ID}`}
      hx-swap={HTMX_SWAP.ReplaceElement}
    >
      {label}
    </a>
  ) as string;
}

export function tabList(activeTab: `${TAB_NAME}`, options: { swapOob: HtmxSwapOobOption }): string {
  const divAttrs: any = {
    id: TAB_LIST_ID,
    role: 'tablist',
    class: 'tabs tabs-lifted',
  };

  const swapOobAttr = swapOobTag(options.swapOob);
  if (swapOobAttr) {
    divAttrs['hx-swap-oob'] = HTMX_SWAP.ReplaceElement;
  }

  return (
    <div {...divAttrs}>
      {tab(texts.navigation.ingredients, activeTab === TAB_NAME.ingredients, '/ingredientsTab')}
      {tab(texts.navigation.recipes, activeTab === TAB_NAME.recipes, '/recipesTab')}
      {tab(texts.navigation.meals, activeTab === TAB_NAME.meals, '/mealsTab')}
    </div>
  ) as string;
}
