import { IngredientTab, INGREDIENT_SEARCH_ID } from '../../src/components/ingredients/ingredient-tab';
import { Ingredient } from '@prisma/client';

describe('Ingredient Tab Component', () => {
  beforeEach(() => {
    cy.visit('/public/test-components.html');
  });

  const renderComponent = async (ingredients: Ingredient[]) => {
    const component = new IngredientTab(ingredients);
    const html = await component.render();
    cy.get('#test-container').then(($el) => {
      $el[0].innerHTML = html;
    });
  };

  const mockIngredient: Ingredient = {
    id: '1',
    name: 'Test Ingredient',
    caloriesPer100: 100,
    carbsPer100: 50,
    fatPer100: 20,
    isVegetable: false,
    isCarbCounted: true,
  };

  it('renders ingredient tab with search and list', () => {
    cy.wrap(null).then(() => renderComponent([mockIngredient]));

    cy.get('#tab-container').should('exist');
    cy.get(`#${INGREDIENT_SEARCH_ID}`).should('exist');
    cy.get('#ingredient-list').should('exist');
    cy.contains('Test Ingredient').should('exist');
  });

  it('allows typing in search field', () => {
    cy.wrap(null).then(() => renderComponent([mockIngredient]));

    cy.get(`#${INGREDIENT_SEARCH_ID}`).type('test search').should('have.value', 'test search');
  });
});
