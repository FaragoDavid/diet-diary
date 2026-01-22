describe('Ingredients Page', () => {
  beforeEach(() => {
    cy.task('db:reset');
    cy.login();
    cy.visit('/dashboard/ingredients');
  });

  describe('Creating ingredients', () => {
    it('creates a new ingredient', () => {
      cy.intercept('POST', '/new-ingredient').as('createIngredient');
      cy.get('#add-ingredient-btn').click();
      cy.get('input[name="ingredientName"]').type('Chicken Breast').blur();
      cy.wait('@createIngredient');

      cy.url().should('match', /\/ingredient\/[a-z0-9-]+/);
      cy.contains('Chicken Breast').should('be.visible');
    });
  });

  describe('Editing ingredients', () => {
    it('updates ingredient nutrition values', () => {
      const ingredientName = 'Test Ingredient';
      cy.task('db:createIngredient', ingredientName).then((result: any) => {
        cy.intercept('POST', '/ingredient/*').as('updateIngredient');
        cy.visit(`/ingredient/${result.id}`);

      cy.get('input[name="calories"]').clear().type('200').blur();
      cy.get('input[name="carbs"]').clear().type('5').blur();
      cy.get('input[name="fat"]').clear().type('10').blur();
      cy.get('input[type="checkbox"][name="isVegetable"]').check();
      cy.wait('@updateIngredient');

      cy.reload();

        cy.get('input[name="calories"]').should('have.value', '200');
        cy.get('input[name="carbs"]').should('have.value', '5');
        cy.get('input[name="fat"]').should('have.value', '10');
        cy.get('input[type="checkbox"][name="isVegetable"]').should('be.checked');
      });
    });
  });

  describe('Searching ingredients', () => {
    it('filters ingredients by search term', () => {
      cy.task('db:createIngredient', 'Searchable Item');
      cy.visit('/dashboard/ingredients');

      cy.get('input[placeholder]').first().type('Searchable');
      cy.contains('Searchable Item').should('be.visible');

      cy.get('input[placeholder]').first().clear().type('NonExistent');
      cy.contains('Searchable Item').should('not.exist');
    });
  });

  describe('Deleting ingredients', () => {
    it('deletes an ingredient', () => {
      const ingredientName = `Delete-Me-${Date.now()}`;
      cy.task('db:createIngredient', ingredientName);
      cy.intercept('DELETE', '/ingredient/*').as('deleteIngredient');
      cy.visit('/dashboard/ingredients');
      cy.contains(ingredientName).should('be.visible');

      cy.contains(ingredientName).nextAll().find('div[hx-delete]').first().click();
      cy.wait('@deleteIngredient');

      cy.contains(ingredientName).should('not.exist');
    });
  });

  describe('Navigation', () => {
    it('navigates from list to detail page', () => {
      cy.task('db:createIngredient', 'Nav Test Ingredient');
      cy.visit('/dashboard/ingredients');
      cy.contains('Nav Test Ingredient').nextAll().find('a.btn-secondary').first().click();

      cy.url().should('match', /\/ingredient\/[a-z0-9-]+/);
      cy.contains('Nav Test Ingredient').should('be.visible');
    });

    it('navigates back to list from detail page', () => {
      cy.task('db:createIngredient', 'Test Nav Item').then((result: any) => {
        cy.visit(`/ingredient/${result.id}`);
        cy.url().should('match', /\/ingredient\/[a-z0-9-]+/);

        cy.get('a[href="/dashboard/ingredients"]').click();
        cy.url().should('include', '/dashboard/ingredients');
        cy.contains('Test Nav Item').should('be.visible');
      });
    });
  });
});
