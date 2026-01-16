import { IngredientListItem } from '../../src/components/ingredients/ingredient-list-item';
import { Ingredient } from '@prisma/client';

describe('Ingredient List Item Component', () => {
  beforeEach(() => {
    cy.visit('/public/test-components.html');
  });

  const renderComponent = async (ingredient: Ingredient) => {
    const component = new IngredientListItem(ingredient);
    const html = await component.render();
    cy.get('#test-container').then(($el) => {
      $el[0].innerHTML = html;
    });
  };

  const mockIngredient: Ingredient = {
    id: 'test-id',
    name: 'Test Ingredient',
    caloriesPer100: 100,
    carbsPer100: 50,
    fatPer100: 20,
    isVegetable: false,
    isCarbCounted: true,
  };

  it('renders ingredient with all macros', () => {
    cy.wrap(null).then(() => renderComponent(mockIngredient));

    cy.contains('Test Ingredient').should('exist');
    cy.contains('Kal').should('exist');
    cy.contains('100').should('exist');
    cy.contains('CH').should('exist');
    cy.contains('50').should('exist');
    cy.contains('zsír').should('exist');
    cy.contains('20').should('exist');
  });
});
