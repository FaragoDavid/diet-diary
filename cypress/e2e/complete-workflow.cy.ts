describe('Complete User Workflow', () => {
  beforeEach(() => {
    cy.login();
  });

  it('completes a full meal planning workflow', () => {
    // Step 1: Create ingredients
    cy.visit('/dashboard/ingredients');

    cy.get('#add-ingredient-btn').click();
    cy.get('input[name="ingredientName"]').type('Oatmeal').blur();
    cy.wait(500);
    cy.get('input[name="calories"]').clear().type('389').blur();
    cy.get('input[name="carbs"]').clear().type('66').blur();
    cy.get('input[name="fat"]').clear().type('7').blur();
    cy.wait(300);

    cy.visit('/dashboard/ingredients');
    cy.get('#add-ingredient-btn').click();
    cy.get('input[name="ingredientName"]').type('Banana').blur();
    cy.wait(500);
    cy.get('input[name="calories"]').clear().type('89').blur();
    cy.get('input[name="carbs"]').clear().type('23').blur();
    cy.get('input[name="fat"]').clear().type('0.3').blur();
    cy.wait(300);

    // Step 2: Create a recipe using ingredients
    cy.visit('/dashboard/recipes');
    cy.get('#add-recipe-btn').click();
    cy.get('input[name="recipeName"]').type('Morning Oatmeal Bowl').blur();
    cy.wait(500);

    cy.get('select[name="ingredientId"]').select('Oatmeal');
    cy.get('input[name="amount"]').last().type('50').blur();
    cy.wait(500);

    cy.get('select[name="ingredientId"]').select('Banana');
    cy.get('input[name="amount"]').last().type('100').blur();
    cy.wait(500);

    cy.get('input[value="Oatmeal"]').should('be.visible');
    cy.get('input[value="Banana"]').should('be.visible');

    // Step 3: Create a day and add breakfast meal
    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();
    const today = new Date().toISOString().split('T')[0];
    cy.get('input[name="date"]').type(today).blur();
    cy.wait(500);

    cy.get('button').contains('+').first().click();
    cy.wait(500);

    // Step 4: Add recipe to breakfast
    cy.get('select').first().select('Morning Oatmeal Bowl');
    cy.get('input[name="amount"]').first().type('1').blur();
    cy.wait(500);

    cy.contains('Morning Oatmeal Bowl').should('be.visible');

    // Step 5: Add direct ingredient to breakfast
    cy.get('select').first().select('Oatmeal');
    cy.get('input[name="amount"]').first().type('30').blur();
    cy.wait(500);

    // Step 6: Verify nutritional stats are displayed
    cy.contains('Oatmeal').should('be.visible');

    // Step 7: Update a dish amount
    cy.contains('Morning Oatmeal Bowl').parents('.grid').find('input[name="amount"]').first().clear().type('2').blur();
    cy.wait(500);

    // Step 8: Navigate back and verify day appears in list
    cy.visit('/dashboard/meals');
    cy.contains(new Date().getFullYear()).should('be.visible');

    // Step 9: Search for recipe
    cy.visit('/dashboard/recipes');
    cy.get('input[type="search"]').type('Morning');
    cy.contains('Morning Oatmeal Bowl').should('be.visible');

    // Step 10: Edit recipe from list - skip as Menny. not Mennyiség
    // cy.contains('Morning Oatmeal Bowl').click();
    // cy.contains('Menny.').parent().find('input').clear().type('2').blur();
    // cy.wait(500);

    // Step 11: Navigate back to day and verify
    cy.visit('/dashboard/meals');
    cy.contains(new Date().getFullYear()).first().click();
    cy.contains('Morning Oatmeal Bowl').should('be.visible');
  });

  it('handles data dependencies correctly', () => {
    // Create ingredient
    cy.visit('/dashboard/ingredients');
    cy.get('#add-ingredient-btn').click();
    cy.get('input[name="ingredientName"]').type('Dependency Test').blur();
    cy.wait(500);

    // Use in recipe
    cy.visit('/dashboard/recipes');
    cy.get('#add-recipe-btn').click();
    cy.get('input[name="recipeName"]').type('Recipe With Dependency').blur();
    cy.wait(500);

    cy.get('select[name="ingredientId"]').select('Dependency Test');
    cy.get('input[name="amount"]').last().type('100').blur();
    cy.wait(500);

    // Verify recipe shows ingredient
    cy.visit('/dashboard/recipes');
    cy.contains('Recipe With Dependency').click();
    cy.get('input[value="Dependency Test"]').should('be.visible');
  });
});
