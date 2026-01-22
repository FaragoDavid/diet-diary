describe('Meals Page', () => {
  beforeEach(() => {
    cy.task('db:reset');
    cy.login();
  });

  describe('Creating days', () => {
    it('creates a new day', () => {
      cy.visit('/dashboard/meals');
      cy.get('#add-day-btn').click();

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');

      cy.wait(1000);
      cy.get('button[name="mealType"][value="breakfast"]').should('be.visible');
    });
  });

  describe('Managing meals', () => {
    beforeEach(() => {
      cy.visit('/dashboard/meals');
      cy.get('#add-day-btn').click();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');
      cy.wait(1000);
    });

    it('adds breakfast meal to a day', () => {
      cy.get('button[name="mealType"][value="breakfast"]').should('be.visible').click();

      cy.wait(500);
      cy.contains('Reggeli').should('be.visible');
    });

    it('adds lunch meal to a day', () => {
      cy.get('button[name="mealType"][value="lunch"]').click();

      cy.wait(500);
      cy.contains('Ebéd').should('be.visible');
    });

    it('adds dinner meal to a day', () => {
      cy.get('button[name="mealType"][value="dinner"]').click();

      cy.wait(500);
      cy.contains('Vacsora').should('be.visible');
    });

    it.skip('removes meal from day', () => {
      cy.get('button[name="mealType"][value="breakfast"]').click();
      cy.wait(500);
      cy.contains('Reggeli').should('be.visible');

      cy.get('button[hx-delete*="/meal/"]').first().should('be.visible').click();

      cy.wait(1000);
      cy.contains('Reggeli').should('not.exist');
      cy.get('button[name="mealType"][value="breakfast"]').should('be.visible');
    });
  });

  describe('Adding dishes to meals', () => {
    let ingredientName: string;
    let recipeName: string;

    beforeEach(() => {
      cy.visit('/dashboard/ingredients');
      cy.get('#add-ingredient-btn').click();
      ingredientName = `Ingredient-${Date.now()}`;
      cy.get('input[name="ingredientName"]').type(ingredientName).blur();
      cy.wait(500);

      cy.visit('/dashboard/recipes');
      cy.get('#add-recipe-btn').click();
      recipeName = `Recipe-${Date.now()}`;
      cy.get('input[name="recipeName"]').type(recipeName).blur();
      cy.wait(500);

      cy.visit('/dashboard/meals');
      cy.get('#add-day-btn').click();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');
      cy.wait(1000);
      cy.get('button[name="mealType"][value="breakfast"]').click();
      cy.wait(500);
    });

    it('adds ingredient dish to breakfast', () => {
      cy.get('select[name="breakfast-dishId"]').last().select(ingredientName);
      cy.get('input[name="amount"]').first().type('150').blur();

      cy.wait(500);
      cy.contains(ingredientName).should('be.visible');
    });

    it('adds recipe dish to breakfast', () => {
      cy.get('select[name="breakfast-dishId"]').last().select(recipeName);
      cy.get('input[name="amount"]').first().type('1').blur();

      cy.wait(500);
      cy.contains(recipeName).should('be.visible');
    });

    it('updates dish amount', () => {
      cy.get('select[name="breakfast-dishId"]').last().select(ingredientName);
      cy.get('input[name="amount"]').first().type('100').blur();

      cy.wait(500);
      cy.contains(ingredientName).parents('.grid').find('input[name="amount"]').first().clear().type('200').blur();

      cy.wait(500);
      cy.reload();
      cy.contains(ingredientName).parents('.grid').find('input[name="amount"]').first().should('have.value', '200');
    });

    it('removes dish from meal', () => {
      cy.get('select[name="breakfast-dishId"]').last().select(ingredientName);
      cy.get('input[name="amount"]').first().type('100').blur();

      cy.wait(500);
      cy.contains(ingredientName).should('be.visible');

      cy.contains(ingredientName).parents('.grid').find('button[hx-delete]').first().click();

      cy.wait(500);
      cy.contains(ingredientName).should('not.exist');
    });
  });

  describe('Navigation', () => {
    it('navigates from meal list to day page', () => {
      cy.visit('/dashboard/meals');
      cy.get('#add-day-btn').click();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');

      cy.wait(1000);
      cy.visit('/dashboard/meals');
      cy.wait(500);

      cy.get('a[href^="/day/"]').first().click();

      cy.url().should('include', '/day/');
    });
  });
});
