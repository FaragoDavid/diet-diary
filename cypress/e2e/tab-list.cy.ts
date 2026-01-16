import { tabList, TAB_NAME, TAB_CONTAINER_ID } from '../../src/components/tab-list';
import { HTMX_SWAP } from '../../src/utils/htmx';

describe('Tab List Component', () => {
  beforeEach(() => {
    cy.visit('/public/test-components.html');
  });

  const renderComponent = (html: string) => {
    cy.get('#test-container').then(($el) => {
      $el[0].innerHTML = html;
    });
  };

  it('renders tab list with ingredients as active tab', () => {
    const html = tabList(TAB_NAME.ingredients, { swapOob: false });
    renderComponent(html);

    cy.get('#tab-list').should('exist');
    cy.get('[role="tab"]').should('have.length', 3);

    cy.get('[role="tab"]').eq(0).should('have.class', 'tab-active');
    cy.get('[role="tab"]').eq(0).should('contain', 'Alapanyagok');
    cy.get('[role="tab"]').eq(0).should('have.attr', 'hx-get', '/ingredientsTab');
    cy.get('[role="tab"]').eq(0).should('have.attr', 'hx-target', `#${TAB_CONTAINER_ID}`);
    cy.get('[role="tab"]').eq(0).should('have.attr', 'hx-swap', HTMX_SWAP.ReplaceElement);
  });

  it('renders tab list with recipes as active tab', () => {
    const html = tabList(TAB_NAME.recipes, { swapOob: false });
    renderComponent(html);

    cy.get('[role="tab"]').eq(0).should('not.have.class', 'tab-active');
    cy.get('[role="tab"]').eq(1).should('have.class', 'tab-active');
    cy.get('[role="tab"]').eq(1).should('contain', 'Receptek');
  });

  it('renders tab list with meals as active tab', () => {
    const html = tabList(TAB_NAME.meals, { swapOob: false });
    renderComponent(html);

    cy.get('[role="tab"]').eq(0).should('not.have.class', 'tab-active');
    cy.get('[role="tab"]').eq(1).should('not.have.class', 'tab-active');
    cy.get('[role="tab"]').eq(2).should('have.class', 'tab-active');
    cy.get('[role="tab"]').eq(2).should('contain', 'Étkezések');
  });

  it('renders all tab links with correct HTMX attributes', () => {
    const html = tabList(TAB_NAME.ingredients, { swapOob: false });
    renderComponent(html);

    cy.get('[role="tab"]').eq(0).should('have.attr', 'hx-get', '/ingredientsTab');
    cy.get('[role="tab"]').eq(1).should('have.attr', 'hx-get', '/recipesTab');
    cy.get('[role="tab"]').eq(2).should('have.attr', 'hx-get', '/mealsTab');
  });
});
