import { IngredientDetails } from '../../src/components/ingredients/ingredient-details';
import { Ingredient } from '@prisma/client';

describe('Ingredient Details Component', () => {
  beforeEach(() => {
    cy.visit('/public/test-components.html');
  });

  const renderComponent = async (ingredient: Ingredient) => {
    const component = new IngredientDetails(ingredient);
    const html = await component.render();
    cy.get('#test-container').then(($el) => {
      $el[0].innerHTML = html;
    });
  };

  const mockIngredient: Ingredient = {
    id: 'test-ingredient-id',
    name: 'test ingredient name',
    caloriesPer100: 100,
    carbsPer100: 50,
    fatPer100: 20,
    isVegetable: false,
    isCarbCounted: true,
  };

  it('renders ingredient details with all fields', () => {
    cy.wrap(null).then(() => renderComponent(mockIngredient));

    cy.get('#ingredient-details').should('exist');
    cy.contains('Kalória:').should('exist');
    cy.get('input[name="calories"]').should('have.value', '100');
    cy.contains('Szénhidrát:').should('exist');
    cy.get('input[name="carbs"]').should('have.value', '50');
    cy.contains('Zsír:').should('exist');
    cy.get('input[name="fat"]').should('have.value', '20');
    cy.get('input[name="isCarbCounted"]').should('be.checked');
    cy.get('input[name="isVegetable"]').should('not.be.checked');
  });

  it('allows toggling checkboxes', () => {
    cy.wrap(null).then(() => renderComponent(mockIngredient));

    cy.get('input[name="isVegetable"]').should('not.be.checked');
    cy.get('input[name="isVegetable"]').click();
    cy.get('input[name="isVegetable"]').should('be.checked');

    cy.get('input[name="isCarbCounted"]').should('be.checked');
    cy.get('input[name="isCarbCounted"]').click();
    cy.get('input[name="isCarbCounted"]').should('not.be.checked');
  });

  it('renders with null values', () => {
    const ingredientWithNulls = {
      id: 'test-ingredient-id',
      name: 'test ingredient name',
      caloriesPer100: null,
      carbsPer100: null,
      fatPer100: null,
      isVegetable: false,
      isCarbCounted: true,
    } as unknown as Ingredient;

    cy.wrap(null).then(() => renderComponent(ingredientWithNulls));

    cy.get('#ingredient-details').should('exist');
    cy.get('input[name="calories"]').should('have.attr', 'placeholder', '0');
    cy.get('input[name="carbs"]').should('have.attr', 'placeholder', '0');
    cy.get('input[name="fat"]').should('have.attr', 'placeholder', '0');
  });
});
