import { HTMX_SWAP } from '../utils/htmx';
import { swapOobTag } from '../utils/swap-oob-wrapper';

const texts = {
  ingredients: 'Alapanyagok',
  recipes: 'Receptek',
  meals: 'Étkezések',
};

export const enum TAB_NAME {
  ingredients = 'ingredients',
  recipes = 'recipes',
  meals = 'meals',
}

export const TAB_CONTAINER_ID = 'tab-container';
const TAB_LIST_ID = 'tab-list';

function tab(label: string, isActive: boolean, href: string) {
  return `
    <a role="tab" 
      class="tab ${isActive ? 'tab-active' : ''}" 
      hx-get="${href}"
      hx-target="#${TAB_CONTAINER_ID}"
      hx-swap="${HTMX_SWAP.ReplaceElement}"
    >${label}</a>
  `;
}

export function tabList(activeTab: `${TAB_NAME}`, options: { swapOob: HtmxSwapOobOption }) {
  return `
    <div 
      id="${TAB_LIST_ID}"
      role="tablists"
      class="tabs tabs-lifted"
      ${swapOobTag(options.swapOob)}
    >
      ${tab(texts.ingredients, activeTab === TAB_NAME.ingredients, '/ingredientsTab')}
      ${tab(texts.recipes, activeTab === TAB_NAME.recipes, '/recipesTab')}
      ${tab(texts.meals, activeTab === TAB_NAME.meals, '/mealsTab')}
    </div>
  `;
}
