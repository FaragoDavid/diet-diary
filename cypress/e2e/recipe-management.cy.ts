describe('Recipe Management', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/dashboard/recipes');
  });

  it('allows user to create a new recipe', () => {
    cy.get('#add-recipe-btn').click();

    cy.get('input[name="recipeName"]').type('Chicken Salad').blur();
    cy.wait(500);

    cy.url().should('match', /\/recipe\/[a-z0-9-]+/);
    cy.contains('Chicken Salad').should('be.visible');
  });

  it('allows user to add ingredients to a recipe', () => {
    cy.visit('/dashboard/ingredients');
    cy.get('#add-ingredient-btn').click();
    const ingredientName = `Lettuce-${Date.now()}`;
    cy.get('input[name="ingredientName"]').type(ingredientName).blur();
    cy.wait(500);

    cy.visit('/dashboard/recipes');
    cy.get('#add-recipe-btn').click();
    cy.get('input[name="recipeName"]').type('Green Salad').blur();
    cy.wait(500);

    cy.get('select[name="ingredientId"]').last().select(ingredientName);
    cy.get('input[name="amount"]').last().type('100').blur();

    cy.wait(500);
    cy.contains(ingredientName).should('be.visible');
    cy.get('input[name="amount"]').first().should('have.value', '100');
  });

  it('allows user to update ingredient amount in recipe', () => {
    cy.visit('/dashboard/ingredients');
    cy.get('#add-ingredient-btn').click();
    const ingredientName = `Tomato-${Date.now()}`;
    cy.get('input[name="ingredientName"]').type(ingredientName).blur();
    cy.wait(500);

    cy.visit('/dashboard/recipes');
    cy.get('#add-recipe-btn').click();
    cy.get('input[name="recipeName"]').type('Tomato Soup').blur();
    cy.wait(500);

    cy.get('select[name="ingredientId"]').last().select(ingredientName);
    cy.get('input[name="amount"]').last().type('150').blur();

    cy.wait(500);
    cy.get('input[name="amount"]').first().clear().type('200').blur();

    cy.wait(500);
    cy.reload();
    cy.get('input[name="amount"]').first().should('have.value', '200');
  });

  it.skip('allows user to update recipe serving amount', () => {
    cy.get('#add-recipe-btn').click();
    cy.get('input[name="recipeName"]').type('Test Recipe').blur();
    cy.wait(500);

    cy.contains('Mennyiség').parent().find('input').clear().type('2');
    cy.contains('Mennyiség').parent().find('input').blur();

    cy.wait(500);
    cy.reload();
    cy.contains('Mennyiség').parent().find('input').should('have.value', '2');
  });

  it('allows user to remove ingredient from recipe', () => {
    cy.visit('/dashboard/ingredients');
    cy.get('#add-ingredient-btn').click();
    const ingredientName = `Cucumber-${Date.now()}`;
    cy.get('input[name="ingredientName"]').type(ingredientName).blur();
    cy.wait(500);

    cy.visit('/dashboard/recipes');
    cy.get('#add-recipe-btn').click();
    cy.get('input[name="recipeName"]').type('Cucumber Salad').blur();
    cy.wait(500);

    cy.get('select[name="ingredientId"]').last().select(ingredientName);
    cy.get('input[name="amount"]').last().type('100').blur();

    cy.wait(500);
    cy.get('input[value="' + ingredientName + '"]').should('be.visible');

    cy.get('button[hx-delete*="/recipe/"][hx-delete*="/ingredient/"]').first().click();

    cy.wait(500);
    cy.get('input[value="' + ingredientName + '"]').should('not.exist');
  });

  it('allows user to delete a recipe', () => {
    cy.get('#add-recipe-btn').click();
    cy.get('input[name="recipeName"]').type('Recipe To Delete').blur();
    cy.wait(500);

    cy.visit('/dashboard/recipes');
    cy.contains('Recipe To Delete').should('be.visible');

    cy.contains('Recipe To Delete').nextAll().find('div[hx-delete]').first().click();

    cy.wait(500);
    cy.contains('Recipe To Delete').should('not.exist');
  });

  it('allows user to search for recipes', () => {
    cy.get('#add-recipe-btn').click();
    cy.get('input[name="recipeName"]').type('Unique Recipe Name').blur();
    cy.wait(500);

    cy.visit('/dashboard/recipes');

    cy.get('input[placeholder]').first().type('Unique');
    cy.contains('Unique Recipe Name').should('be.visible');

    cy.get('input[placeholder]').first().clear().type('NonExistent');
    cy.contains('Unique Recipe Name').should('not.exist');
  });

  it.skip('displays validation error for empty recipe name', () => {
    cy.get('#add-recipe-btn').click();
    cy.get('input[name="recipeName"]').focus().blur();

    cy.contains('Recipe name is required').should('be.visible');
  });

  it.skip('displays validation error for invalid ingredient amount', () => {
    cy.visit('/dashboard/ingredients');
    cy.get('#add-ingredient-btn').click();
    cy.get('input[name="ingredientName"]').type('Test Ingredient').blur();
    cy.wait(500);

    cy.visit('/dashboard/recipes');
    cy.get('#add-recipe-btn').click();
    cy.get('input[name="recipeName"]').type('Test Recipe').blur();
    cy.wait(500);

    cy.get('select[name="ingredientId"]').last().select('Test Ingredient');
    cy.get('input[name="amount"]').type('-5');
    cy.get('button').contains('Hozzáadás').click();

    cy.contains('Invalid amount').should('be.visible');
  });
});
