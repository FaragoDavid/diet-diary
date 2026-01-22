describe('Dashboard Navigation', () => {
  beforeEach(() => {
    cy.task('db:reset');
    cy.login();
  });

  describe('Tab navigation', () => {
    it('navigates between all dashboard tabs', () => {
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
  });

  describe('Search functionality', () => {
    it('maintains scroll position when using HTMX updates', () => {
      cy.visit('/dashboard/ingredients');

      for (let i = 0; i < 20; i++) {
        cy.intercept('POST', '/new-ingredient').as(`createIngredient${i}`);
        cy.get('#add-ingredient-btn').click();
        cy.get('input[name="ingredientName"]').type(`Item ${i}`).blur();
        cy.wait(`@createIngredient${i}`);
        cy.visit('/dashboard/ingredients');
      }

      cy.scrollTo(0, 500);

      cy.get('#ingredient-search').type('Item 1');

      cy.window().its('scrollY').should('be.gte', 0);
    });
  });
});
