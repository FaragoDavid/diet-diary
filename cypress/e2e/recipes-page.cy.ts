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
      cy.get('input[name="amount"]').should('be.visible');
      cy.get('select[name="ingredientId"]').should('be.visible');
      cy.get('a[href="/dashboard/recipes"]').should('be.visible');
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
      cy.get('input[value="' + ingredientName + '"]').should('exist');
      cy.get('button[hx-delete*="/recipe/"][hx-delete*="/ingredient/"]').should('exist');
      cy.get('select[name="ingredientId"]').should('be.visible');
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
      cy.get(`input[value="${ingredientName}"]`).should('exist');
      cy.get(`input[name="amount"]`).should('have.length.greaterThan', 1);

      cy.get('input[name="amount"]').eq(1).clear().type('200').blur();
      cy.wait(500);
      cy.reload();
      cy.get('input[name="amount"]').eq(1).should('have.value', '200');
      cy.get(`input[value="${ingredientName}"]`).should('exist');
      cy.get('button[hx-delete*="/recipe/"][hx-delete*="/ingredient/"]').should('exist');
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
      cy.get('button[hx-delete*="/recipe/"][hx-delete*="/ingredient/"]').should('exist');

      cy.get('button[hx-delete*="/recipe/"][hx-delete*="/ingredient/"]').first().click();
      cy.wait('@deleteIngredient');

      cy.get('input[value="' + ingredientName + '"]').should('not.exist');
      cy.get('select[name="ingredientId"]').should('be.visible');
    });
  });

  describe('Searching recipes', () => {
    it('has search input with proper HTMX attributes', () => {
      cy.visit('/dashboard/recipes');
      
      cy.get('#search-recipe')
        .should('exist')
        .and('have.attr', 'hx-get', '/recipes')
        .and('have.attr', 'hx-target', '#recipe-list')
        .and('have.attr', 'hx-trigger', 'input');
    });
  });

  describe('Deleting recipes', () => {
    it('deletes a recipe', () => {
      const recipeName = `Recipe-To-Delete-${Date.now()}`;
      cy.task('db:createRecipe', recipeName);
      cy.intercept('DELETE', '/recipe/*').as('deleteRecipe');
      cy.visit('/dashboard/recipes');
      cy.contains(recipeName).should('be.visible');
      cy.contains(recipeName).nextAll().find('a.btn-secondary').should('exist');
      cy.contains(recipeName).nextAll().find('div[hx-delete]').should('exist');

      cy.contains(recipeName).nextAll().find('div[hx-delete]').first().click();
      cy.wait('@deleteRecipe');

      cy.contains(recipeName).should('not.exist');
      cy.get('#add-recipe-btn').should('be.visible');
    });
  });

  describe('Recipe amount', () => {
    it('updates recipe serving amount', () => {
      cy.task('db:createRecipe', 'Test Amount Recipe').then((result: any) => {
        cy.intercept('POST', `/recipe/${result.id}/amount`).as('updateAmount');
        cy.visit(`/recipe/${result.id}`);
        
        cy.get('#recipe-details input[name="amount"]').clear().type('250').blur();
        cy.wait('@updateAmount');
        
        cy.reload();
        cy.get('#recipe-details input[name="amount"]').should('have.value', '250');
      });
    });
  });

  describe('Empty states', () => {
    it('shows add button when no recipes exist', () => {
      cy.visit('/dashboard/recipes');
      cy.get('#add-recipe-btn').should('be.visible');
    });
  });

  describe('Navigation', () => {
    it('navigates from list to detail page', () => {
      cy.task('db:createRecipe', 'Nav Test Recipe');
      cy.visit('/dashboard/recipes');
      cy.contains('Nav Test Recipe').should('be.visible');
      cy.contains('Nav Test Recipe').nextAll().find('a.btn-secondary').should('exist');
      cy.contains('Nav Test Recipe').nextAll().find('a.btn-secondary').first().click();

      cy.url().should('match', /\/recipe\/[a-z0-9-]+/);
      cy.contains('Nav Test Recipe').should('be.visible');
      cy.get('input[name="amount"]').should('exist');
      cy.get('select[name="ingredientId"]').should('exist');
      cy.get('a[href="/dashboard/recipes"]').should('be.visible');
    });

    it('navigates directly via URL', () => {
      cy.task('db:createRecipe', 'Direct Nav Recipe').then((result: any) => {
        cy.visit(`/recipe/${result.id}`);

        cy.contains('Direct Nav Recipe').should('be.visible');
        cy.get('input[name="amount"]').should('exist');
        cy.get('select[name="ingredientId"]').should('exist');
      });
    });
  });
});
