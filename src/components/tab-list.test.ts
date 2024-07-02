import { expect } from '@jest/globals';

import '../toContainHtml';
import { HTMX_SWAP } from '../utils/htmx';
import { TAB_CONTAINER_ID, TAB_NAME, tabList } from './tab-list';

describe('Tab List', () => {
  ([TAB_NAME.ingredients] as `${TAB_NAME}`[]).forEach((tab) => {
    it(`renders the tab list with ${tab} as the active tab`, async () => {
      expect(tabList(tab, { swapOob: false })).toContainHtml(`
        <div id="tab-list" role="tablist" class="tabs tabs-lifted">
          <a role="tab" 
            class="tab ${tab === TAB_NAME.ingredients ? 'tab-active' : ''}" 
            hx-get="/ingredientsTab"
            hx-target="#${TAB_CONTAINER_ID}"
            hx-swap="${HTMX_SWAP.ReplaceElement}"
          >Alapanyagok</a>
          <a 
            role="tab" 
            class="tab ${tab === TAB_NAME.recipes ? 'tab-active' : ''}" 
            hx-get="/recipesTab"
            hx-target="#${TAB_CONTAINER_ID}"
            hx-swap="${HTMX_SWAP.ReplaceElement}"
          >Receptek</a>
          <a 
            role="tab" 
            class="tab ${tab === TAB_NAME.meals ? 'tab-active' : ''}" 
            hx-get="/mealsTab"
            hx-target="#${TAB_CONTAINER_ID}"
            hx-swap="${HTMX_SWAP.ReplaceElement}"
          >Étkezések</a>
        </div>
      `);
    });
  });
});
