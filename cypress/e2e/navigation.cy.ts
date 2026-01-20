describe('Navigation and Tabs', () => {
  beforeEach(() => {
    cy.login();
  });

  it('allows user to navigate between tabs', () => {
    cy.visit('/dashboard/ingredients');
    cy.contains('Alapanyagok').should('be.visible');

    cy.contains('Receptek').click();
    cy.url().should('include', '/dashboard/recipes');
    cy.get('#add-recipe-btn').should('be.visible');

    cy.contains('Étkezések').click();
    cy.url().should('include', '/dashboard/meals');
    cy.get('#add-day-btn').should('be.visible');

    cy.contains('Alapanyagok').click();
    cy.url().should('include', '/dashboard/ingredients');
  });

  it('preserves navigation state when creating items', () => {
    cy.visit('/dashboard/ingredients');

    cy.get('#add-ingredient-btn').click();
    cy.get('input[name="ingredientName"]').type('Test Nav Item');
    cy.get('form').submit();

    cy.url().should('match', /\/ingredient\/[a-z0-9-]+/);

    cy.contains('← Vissza').click();
    cy.url().should('include', '/dashboard/ingredients');
    cy.contains('Test Nav Item').should('be.visible');
  });

  it('allows navigation from ingredient list to detail page', () => {
    cy.visit('/dashboard/ingredients');

    cy.get('#add-ingredient-btn').click();
    cy.get('input[name="ingredientName"]').type('Nav Test Ingredient');
    cy.get('form').submit();

    cy.visit('/dashboard/ingredients');
    cy.contains('Nav Test Ingredient').click();

    cy.url().should('match', /\/ingredient\/[a-z0-9-]+/);
    cy.contains('Nav Test Ingredient').should('be.visible');
  });

  it('allows navigation from recipe list to detail page', () => {
    cy.visit('/dashboard/recipes');

    cy.get('#add-recipe-btn').click();
    cy.get('input[name="recipeName"]').type('Nav Test Recipe');
    cy.get('form').submit();

    cy.visit('/dashboard/recipes');
    cy.contains('Nav Test Recipe').click();

    cy.url().should('match', /\/recipe\/[a-z0-9-]+/);
    cy.contains('Nav Test Recipe').should('be.visible');
  });

  it('allows navigation from meal list to day page', () => {
    cy.visit('/dashboard/meals');

    cy.get('#add-day-btn').click();
    const today = new Date().toISOString().split('T')[0];
    cy.get('input[name="date"]').type(today);
    cy.get('form').submit();

    cy.visit('/dashboard/meals');
    cy.contains(new Date().getFullYear()).first().click();

    cy.url().should('include', '/meal/');
  });

  it('maintains scroll position when using HTMX updates', () => {
    cy.visit('/dashboard/ingredients');

    for (let i = 0; i < 20; i++) {
      cy.get('#add-ingredient-btn').click();
      cy.get('input[name="ingredientName"]').type(`Item ${i}`);
      cy.get('form').submit();
      cy.visit('/dashboard/ingredients');
    }

    cy.scrollTo(0, 500);

    cy.get('input[type="search"]').type('Item 1');

    cy.window().its('scrollY').should('be.gte', 0);
  });
});
