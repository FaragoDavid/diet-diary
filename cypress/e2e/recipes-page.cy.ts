describe('Recipes Page', () => {
  beforeEach(() => {
    cy.task('db:reset');
    cy.login();
  });

  describe('Creating recipes', () => {
    it('creates a new recipe', () => {
      cy.visit('/dashboard/recipes');
      cy.intercept('POST', '/new-recipe').as('createRecipe');
      cy.get('#add-recipe-btn').click();

      cy.get('input[name="recipeName"]').type('Chicken Salad').blur();
      cy.wait('@createRecipe');

      cy.url().should('match', /\/recipe\/[a-z0-9-]+/);
      cy.contains('Chicken Salad').should('be.visible');
    });

    it('creates a recipe with ingredients', () => {
      const ingredientName = `Lettuce-${Date.now()}`;
      cy.task('db:createIngredient', ingredientName);

      cy.visit('/dashboard/recipes');
      cy.intercept('POST', '/new-recipe').as('createRecipe');
      cy.intercept('POST', '/recipe/*/ingredient').as('addIngredient');
      cy.get('#add-recipe-btn').click();
      cy.get('input[name="recipeName"]').type('Green Salad').blur();
      cy.wait('@createRecipe');

      cy.get('select[name="ingredientId"]').last().select(ingredientName);
      cy.get('input[name="amount"]').last().type('100').blur();
      cy.wait('@addIngredient');
      cy.contains(ingredientName).should('be.visible');
      cy.get('input[name="amount"]').first().should('have.value', '100');
    });
  });

  describe('Editing recipes', () => {
    let ingredientName: string;

    beforeEach(() => {
      ingredientName = `Tomato-${Date.now()}`;
      cy.task('db:createIngredient', ingredientName);
    });

    it('updates ingredient amount in recipe', () => {
      cy.visit('/dashboard/recipes');
      cy.intercept('POST', '/new-recipe').as('createRecipe');
      cy.intercept('POST', /\/recipe\/[^/]+\/ingredient\/[^/]+/).as('updateIngredient');
      cy.intercept('POST', '/recipe/*/ingredient').as('addIngredient');
      cy.get('#add-recipe-btn').click();
      cy.get('input[name="recipeName"]').type('Tomato Soup').blur();
      cy.wait('@createRecipe');

      cy.get('select[name="ingredientId"]').last().select(ingredientName);
      cy.get('input[name="amount"]').last().type('150').blur();
      cy.wait('@addIngredient');

      cy.get('input[name="amount"]').first().clear().type('200').blur();
      cy.wait(500);
      cy.reload();
      cy.get('input[name="amount"]').first().should('have.value', '200');
    });

    it('removes ingredient from recipe', () => {
      cy.visit('/dashboard/recipes');
      cy.intercept('POST', '/new-recipe').as('createRecipe');
      cy.intercept('POST', '/recipe/*/ingredient').as('addIngredient');
      cy.intercept('DELETE', '/recipe/*/ingredient/*').as('deleteIngredient');
      cy.get('#add-recipe-btn').click();
      cy.get('input[name="recipeName"]').type('Test Recipe').blur();
      cy.wait('@createRecipe');

      cy.get('select[name="ingredientId"]').last().select(ingredientName);
      cy.get('input[name="amount"]').last().type('100').blur();
      cy.wait('@addIngredient');

      cy.get('input[value="' + ingredientName + '"]').should('be.visible');

      cy.get('button[hx-delete*="/recipe/"][hx-delete*="/ingredient/"]').first().click();
      cy.wait('@deleteIngredient');
      cy.get('input[value="' + ingredientName + '"]').should('not.exist');
    });
  });

  describe('Searching recipes', () => {
    it('filters recipes by search term', () => {
      cy.task('db:createRecipe', 'Unique Recipe Name');
      cy.visit('/dashboard/recipes');

      cy.get('input[placeholder]').first().type('Unique');
      cy.contains('Unique Recipe Name').should('be.visible');

      cy.get('input[placeholder]').first().clear().type('NonExistent');
      cy.contains('Unique Recipe Name').should('not.exist');
    });
  });

  describe('Deleting recipes', () => {
    it('deletes a recipe', () => {
      cy.visit('/dashboard/recipes');
      const recipeName = `Recipe-To-Delete-${Date.now()}`;
      cy.get('#add-recipe-btn').click();
      cy.get('input[name="recipeName"]').type(recipeName).blur();
      cy.wait(500);

      cy.visit('/dashboard/recipes');
      cy.contains(recipeName).should('be.visible');

      cy.contains(recipeName).nextAll().find('div[hx-delete]').first().click();

      cy.wait(500);
      cy.contains(recipeName).should('not.exist');
    });
  });

  describe('Navigation', () => {
    it('navigates from list to detail page', () => {
      cy.visit('/dashboard/recipes');
      cy.get('#add-recipe-btn').click();
      cy.get('input[name="recipeName"]').type('Nav Test Recipe').blur();

      cy.wait(500);
      cy.visit('/dashboard/recipes');
      cy.contains('Nav Test Recipe').nextAll().find('a.btn-secondary').first().click();

      cy.url().should('match', /\/recipe\/[a-z0-9-]+/);
      cy.contains('Nav Test Recipe').should('be.visible');
    });
  });
});
