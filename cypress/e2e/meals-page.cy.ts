describe('Meals Page', () => {
  beforeEach(() => {
    cy.task('db:reset');
    cy.login();
  });

  describe('Creating days', () => {
    it('creates a new day', () => {
      cy.visit('/dashboard/meals');
      cy.intercept('POST', '/new-day').as('createDay');
      cy.get('#add-day-btn').click();

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');
      cy.wait('@createDay');

      cy.get('button[name="mealType"][value="morningSnack"]').should('be.visible');
      cy.get('button[name="mealType"][value="breakfast"]').should('be.visible');
      cy.get('button[name="mealType"][value="brunch"]').should('be.visible');
      cy.get('button[name="mealType"][value="lunch"]').should('be.visible');
      cy.get('button[name="mealType"][value="afternoonSnack"]').should('be.visible');
      cy.get('button[name="mealType"][value="dinner"]').should('be.visible');
      cy.get('button[name="mealType"][value="lateNightSnack"]').should('be.visible');

      cy.get('#day-header').should('be.visible').and('contain', tomorrow.getFullYear());

      cy.get('[id*="-stats"]').should('be.visible');

      const expectedDateParam = tomorrowStr.split('-').join('');
      cy.url().should('include', `/day/${expectedDateParam}`);
    });
  });

  describe('Managing meals', () => {
    let dayDate: string;

    beforeEach(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dayDate = tomorrow.toISOString().split('T')[0];

      cy.task('db:createDay', dayDate);
      cy.visit(`/day/${dayDate.replace(/-/g, '')}`);
    });

    it('adds all meal types to a day', () => {
      const mealTypes = [
        { meal: 'morningSnack', name: 'Előreggeli' },
        { meal: 'breakfast', name: 'Reggeli' },
        { meal: 'brunch', name: 'Tízórai' },
        { meal: 'lunch', name: 'Ebéd' },
        { meal: 'afternoonSnack', name: 'Uzsonna' },
        { meal: 'dinner', name: 'Vacsora' },
        { meal: 'lateNightSnack', name: 'Utóvacsora' },
      ];

      mealTypes.forEach(({ meal, name }) => {
        cy.intercept('POST', '/day/*/meal').as(`addMeal-${meal}`);
        cy.get(`button[name="mealType"][value="${meal}"]`).click();
        cy.wait(`@addMeal-${meal}`);
        cy.contains(name).should('be.visible');
        cy.get(`button[hx-delete*="/meal/${meal}"]`).should('exist');
        cy.get(`select[name="${meal}-dishId"]`).should('be.visible');
        cy.get(`button[name="mealType"][value="${meal}"]`).should('not.exist');
      });
    });

    it('removes meal from day', () => {
      cy.intercept('POST', '/day/*/meal').as('addMeal');
      cy.intercept('DELETE', '/day/*/meal/*').as('deleteMeal');
      cy.get('button[name="mealType"][value="breakfast"]').click();
      cy.wait('@addMeal');
      cy.contains('Reggeli').should('be.visible');

      const deleteButtonSelector = 'button[hx-delete*="/meal/"]';
      cy.get(deleteButtonSelector).first().should('be.visible').click();
      cy.wait('@deleteMeal');
      cy.get(deleteButtonSelector).should('not.exist');
      cy.get('select[name="breakfast-dishId"]').should('not.exist');
      cy.get('button[name="mealType"][value="breakfast"]').should('be.visible');
    });
  });

  describe('Adding dishes to meals', () => {
    let ingredientName: string;
    let recipeName: string;
    let dayDate: string;

    beforeEach(() => {
      ingredientName = `Ingredient-${Date.now()}`;
      recipeName = `Recipe-${Date.now()}`;

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dayDate = tomorrow.toISOString().split('T')[0];

      cy.task('db:createIngredient', ingredientName);
      cy.task('db:createRecipe', recipeName);
      cy.task('db:createDayWithMeal', { date: dayDate, mealType: 'breakfast' });

      cy.visit(`/day/${dayDate.replace(/-/g, '')}`);
    });

    it('adds ingredient dish to breakfast', () => {
      cy.intercept('POST', '/day/*/meal/*/dish').as('addDish');
      cy.get('select[name="breakfast-dishId"]').last().select(ingredientName);
      cy.get('input[name="amount"]').first().type('150').blur();
      cy.wait('@addDish');

      cy.contains(ingredientName).should('be.visible');
    });

    it('adds recipe dish to breakfast', () => {
      cy.intercept('POST', '/day/*/meal/*/dish').as('addDish');
      cy.get('select[name="breakfast-dishId"]').last().select(recipeName);
      cy.get('input[name="amount"]').first().type('1').blur();
      cy.wait('@addDish');

      cy.contains(recipeName).should('be.visible');
    });

    it('updates dish amount', () => {
      cy.intercept('POST', '/day/*/meal/*/dish').as('addDish');
      cy.intercept('POST', '/day/*/meal/*/dish/*').as('updateDish');
      cy.get('select[name="breakfast-dishId"]').last().select(ingredientName);
      cy.get('input[name="amount"]').first().type('100').blur();
      cy.wait('@addDish');

      cy.reload();
      cy.contains(ingredientName).parents('.grid').find('input[name="amount"]').first().clear().type('200').blur();
      cy.wait('@updateDish');

      cy.reload();
      cy.contains(ingredientName).parents('.grid').find('input[name="amount"]').first().should('have.value', '200');
    });

    it('removes dish from meal', () => {
      cy.intercept('POST', '/day/*/meal/*/dish').as('addDish');
      cy.get('select[name="breakfast-dishId"]').last().select(ingredientName);
      cy.get('input[name="amount"]').first().type('100').blur();
      cy.wait('@addDish');

      cy.contains(ingredientName).should('be.visible');

      cy.contains(ingredientName).parents('.grid').find('button[hx-delete]').first().click();
      cy.wait(500);
      cy.contains(ingredientName).should('not.exist');
    });

    it('adds multiple dishes to same meal', () => {
      cy.intercept('POST', '/day/*/meal/*/dish').as('addDish');

      cy.get('select[name="breakfast-dishId"]').last().select(ingredientName);
      cy.get('input[name="amount"]').first().type('100').blur();
      cy.wait('@addDish');
      cy.contains(ingredientName).should('be.visible');

      cy.reload();
      cy.wait(500);

      cy.get('select[name="breakfast-dishId"]').last().select(recipeName);
      cy.get('input[name="amount"]').first().type('1').blur();
      cy.wait(500);

      cy.contains(ingredientName).should('be.visible');
      cy.contains(recipeName).should('be.visible');
    });
  });

  describe('Navigation', () => {
    it('navigates from meal list to day page', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      cy.task('db:createDay', tomorrowStr);
      cy.visit('/dashboard/meals');

      cy.get('a[href^="/day/"]').first().click();

      cy.url().should('include', '/day/');
    });
  });

  describe('Recipe versioning', () => {
    let dayDate: string;
    let dayDateParam: string;
    let recipeName: string;

    beforeEach(() => {
      recipeName = `TestRecipe-${Date.now()}`;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dayDate = tomorrow.toISOString().split('T')[0];
      dayDateParam = dayDate.replace(/-/g, '');

      cy.task('db:createDayWithMealAndRecipeDish', {
        date: dayDate,
        mealType: 'breakfast',
        recipeName,
      });
    });

    it('shows copy button for recipe dishes', () => {
      cy.visit(`/day/${dayDateParam}`);
      cy.contains(recipeName).parents('.grid').find('button[hx-post*="/version"]').should('exist');
    });

    it('creates a version with Hungarian date format', () => {
      cy.visit(`/day/${dayDateParam}`);
      cy.intercept('POST', '/day/*/meal/*/dish/*/version').as('createVersion');

      cy.contains(recipeName).parents('.grid').find('button[hx-post*="/version"]').click();
      cy.wait('@createVersion');

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const year = tomorrow.getFullYear();

      cy.get('[class*="grid"]').should('contain.text', recipeName);
      cy.get('[class*="grid"]').should('contain.text', '(');
      cy.get('[class*="grid"]').should('contain.text', year.toString());
    });
  });
});
