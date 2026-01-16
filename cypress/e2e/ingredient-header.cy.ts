import { newIngredientHeader, ingredientHeader } from '../../src/components/ingredients/ingredient-header';
import { INGREDIENT_PAGE_ID } from '../../src/pages/ingredient';
import { Ingredient } from '@prisma/client';

describe('Ingredient Header Component', () => {
  beforeEach(() => {
    cy.visit('/public/test-components.html');
  });

  const renderComponent = (html: string) => {
    cy.get('#test-container').then(($el) => {
      $el[0].innerHTML = html;
    });
  };

  it('renders new ingredient header', () => {
    const html = newIngredientHeader();
    renderComponent(html);

    cy.get('#ingredient-header').should('exist');
    cy.get('#ingredient-header').should('have.attr', 'type', 'text');
    cy.get('#ingredient-header').should('have.attr', 'name', 'ingredientName');
    cy.get('#ingredient-header').should('have.attr', 'placeholder', 'Alapanyag neve');
    cy.get('#ingredient-header').should('have.attr', 'hx-post', '/new-ingredient');
    cy.get('#ingredient-header').should('have.attr', 'hx-target', `#${INGREDIENT_PAGE_ID}`);
  });

  it('renders ingredient header with name', () => {
    const mockIngredient: Ingredient = {
      id: 'test-id',
      name: 'test ingredient name',
      caloriesPer100: 100,
      carbsPer100: 50,
      fatPer100: 20,
      isVegetable: false,
      isCarbCounted: true,
    };
    const html = ingredientHeader(mockIngredient);
    renderComponent(html);

    cy.get('#ingredient-header').should('contain', mockIngredient.name);
    cy.get('#ingredient-header').should('have.class', 'text-2xl');
    cy.get('#ingredient-header').should('have.class', 'text-center');
    cy.get('#ingredient-header').should('have.class', 'text-primary');
  });
});
