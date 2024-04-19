import config from '../config.js';

export const enum TAB_NAME {
  ingredients = 'ingredients',
  recipes = 'recipes',
  meals = 'meals',
}

function tab(label: string, isActive: boolean, href: string) {
  return `
    <a 
      role="tab" 
      class="tab ${isActive ? 'tab-active' : ''}" 
      hx-get="${href}"
      hx-target="#tab-container"
    >${label}</a>
  `;
}

export function tabList(activeTab: `${TAB_NAME}`, swap: boolean) {
  return `
    <div 
      id="tab-list" 
      role="tablist" 
      class="tabs tabs-lifted" 
      ${swap ? 'hx-swap-oob="true"' : ''}
    >
      ${tab(config.ingredients.title, activeTab === TAB_NAME.ingredients, '/ingredientsTab')}
      ${tab(config.recipes.title, activeTab === TAB_NAME.recipes, '/recipesTab')}
      ${tab(config.meals.title, activeTab === TAB_NAME.meals, '/mealsTab')}
    </div>
  `;
}
