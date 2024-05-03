import config from '../config.js';
import { HTMX_SWAP } from '../utils/htmx.js';
import { swapOobTag } from '../utils/swap-oob-wrapper.js';

export const enum TAB_NAME {
  ingredients = 'ingredients',
  recipes = 'recipes',
  meals = 'meals',
}

export const TAB_CONTAINER_ID = 'tab-container';

function tab(label: string, isActive: boolean, href: string) {
  return `
    <a 
      role="tab" 
      class="tab ${isActive ? 'tab-active' : ''}" 
      hx-get="${href}"
      hx-target="#${TAB_CONTAINER_ID}"
      hx-swap="${HTMX_SWAP.ReplaceElement}"
    >${label}</a>
  `;
}

export function tabList(activeTab: `${TAB_NAME}`, options: {swapOob: HtmxSwapOobOption}) {
  return `
    <div 
      role="tablist" 
      class="tabs tabs-lifted" 
      ${swapOobTag(options.swapOob)}
    >
      ${tab(config.ingredients.title, activeTab === TAB_NAME.ingredients, '/ingredientsTab')}
      ${tab(config.recipes.title, activeTab === TAB_NAME.recipes, '/recipesTab')}
      ${tab(config.meals.title, activeTab === TAB_NAME.meals, '/mealsTab')}
    </div>
  `;
}
