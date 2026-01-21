describe('Ingredient Management', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/dashboard/ingredients');
  });

  it('allows user to create a new ingredient', () => {
    cy.get('#add-ingredient-btn').click();

    cy.get('input[name="ingredientName"]').type('Chicken Breast').blur();

    cy.url().should('match', /\/ingredient\/[a-z0-9-]+/);
    cy.contains('Chicken Breast').should('be.visible');
  });

  it('allows user to update ingredient nutrition values', () => {
    cy.get('#add-ingredient-btn').click();
    cy.get('input[name="ingredientName"]').type('Test Ingredient').blur();

    cy.wait(500);

    cy.get('input[name="calories"]').clear().type('200').blur();
    cy.get('input[name="carbs"]').clear().type('5').blur();
    cy.get('input[name="fat"]').clear().type('10').blur();
    cy.get('input[type="checkbox"][name="isVegetable"]').check();

    cy.wait(500);
    cy.reload();

    cy.get('input[name="calories"]').should('have.value', '200');
    cy.get('input[name="carbs"]').should('have.value', '5');
    cy.get('input[name="fat"]').should('have.value', '10');
    cy.get('input[type="checkbox"][name="isVegetable"]').should('be.checked');
  });

  it('allows user to search for ingredients', () => {
    cy.get('#add-ingredient-btn').click();
    cy.get('input[name="ingredientName"]').type('Searchable Item').blur();

    cy.visit('/dashboard/ingredients');

    cy.get('input[placeholder]').first().type('Searchable');
    cy.contains('Searchable Item').should('be.visible');

    cy.get('input[placeholder]').first().clear().type('NonExistent');
    cy.contains('Searchable Item').should('not.exist');
  });

  it('allows user to delete an ingredient', () => {
    const ingredientName = `Delete-Me-${Date.now()}`;
    
    cy.get('#add-ingredient-btn').click();
    cy.get('input[name="ingredientName"]').type(ingredientName).blur();
    cy.wait(500);

    cy.visit('/dashboard/ingredients');
    cy.contains(ingredientName).should('be.visible');

    cy.contains(ingredientName).nextAll().find('div[hx-delete]').first().click();

    cy.wait(500);
    cy.contains(ingredientName).should('not.exist');
  });

  it.skip('displays validation error for empty ingredient name', () => {
    cy.get('#add-ingredient-btn').click();
    cy.get('input[name="ingredientName"]').type(' ').clear().blur();
    cy.wait(500);

    cy.contains('Ingredient name is required').should('be.visible');
  });
});
