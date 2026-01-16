import { IngredientSelector } from '../../src/components/recipes/ingredient-selector';
import { Ingredient } from '@prisma/client';
import { HTMX_SWAP } from '../../src/utils/htmx';

describe('Ingredient Selector Component', () => {
  beforeEach(() => {
    cy.visit('/public/test-components.html');
  });

  const renderComponent = async (ingredients: Ingredient[], recipeIngredientIds: string[], swapOob: HtmxSwapOobOption) => {
    const component = new IngredientSelector(recipeIngredientIds, ingredients, { swapOob });
    const html = await component.render();
    cy.get('#test-container').then(($el) => {
      $el[0].innerHTML = html;
    });
  };

  const mockIngredients: Ingredient[] = [
    {
      id: '1',
      name: 'Ingredient 1',
      caloriesPer100: 100,
      carbsPer100: 50,
      fatPer100: 20,
      isVegetable: false,
      isCarbCounted: true,
    },
    {
      id: '2',
      name: 'Ingredient 2',
      caloriesPer100: 200,
      carbsPer100: 60,
      fatPer100: 30,
      isVegetable: true,
      isCarbCounted: false,
    },
    {
      id: '3',
      name: 'Ingredient 3',
      caloriesPer100: 150,
      carbsPer100: 40,
      fatPer100: 25,
      isVegetable: false,
      isCarbCounted: true,
    },
  ];

  it('renders ingredient selector with options', () => {
    cy.wrap(null).then(() => renderComponent(mockIngredients, [], false));

    cy.get('#ingredient-selector').should('exist');
    cy.get('select[name="ingredientId"]').should('exist');
    cy.get('select[name="ingredientId"] option').should('have.length', 4);
    cy.contains('Ingredient 1').should('exist');
    cy.contains('Ingredient 2').should('exist');
    cy.contains('Ingredient 3').should('exist');
  });

  it('renders with hx-swap-oob attribute', () => {
    cy.wrap(null).then(() => renderComponent(mockIngredients, [], HTMX_SWAP.ReplaceElement));

    cy.get('#ingredient-selector').should('have.attr', 'hx-swap-oob', 'outerHTML');
  });

  it('filters out already selected ingredients', () => {
    cy.wrap(null).then(() => renderComponent(mockIngredients, ['1'], false));

    cy.get('select[name="ingredientId"] option').should('have.length', 3);
    cy.contains('Ingredient 1').should('not.exist');
    cy.contains('Ingredient 2').should('exist');
    cy.contains('Ingredient 3').should('exist');
  });
});
