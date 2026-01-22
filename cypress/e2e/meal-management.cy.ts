describe('Meal Management', () => {
  beforeEach(() => {
    cy.task('db:reset');
    cy.login();
  });

  it('allows user to create a new day', () => {
    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');
    
    cy.wait(1000);
    cy.get('button[name="mealType"][value="breakfast"]').should('be.visible');
  });

  it('allows user to add meals to a day', () => {
    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');
    cy.wait(1000);

    cy.get('button[name="mealType"][value="breakfast"]').should('be.visible').click();

    cy.wait(500);
    cy.contains('Reggeli').should('be.visible');
  });

  it('allows user to add ingredient dish to a meal', () => {
    cy.visit('/dashboard/ingredients');
    cy.get('#add-ingredient-btn').click();
    const uniqueName = `Rice-${Date.now()}`;
    cy.get('input[name="ingredientName"]').type(uniqueName).blur();
    cy.wait(500);

    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); const tomorrowStr = tomorrow.toISOString().split('T')[0];
    cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');
    cy.wait(1000);

    cy.get('button[name="mealType"][value="breakfast"]').click();
    cy.wait(500);

    cy.get('select[name="breakfast-dishId"]').last().select(uniqueName);
    cy.get('input[name="amount"]').first().type('150').blur();

    cy.wait(500);
    cy.contains(uniqueName).should('be.visible');
  });

  it('allows user to add recipe dish to a meal', () => {
    cy.visit('/dashboard/recipes');
    cy.get('#add-recipe-btn').click();
    const uniqueName = `Breakfast-Bowl-${Date.now()}`;
    cy.get('input[name="recipeName"]').type(uniqueName).blur();
    cy.wait(500);

    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); const tomorrowStr = tomorrow.toISOString().split('T')[0];
    cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');
    cy.wait(1000);

    cy.get('button[name="mealType"][value="breakfast"]').click();
    cy.wait(500);

    cy.get('select[name="breakfast-dishId"]').last().select(uniqueName);
    cy.get('input[name="amount"]').first().type('1').blur();

    cy.wait(500);
    cy.contains(uniqueName).should('be.visible');
  });

  it('allows user to update dish amount', () => {
    cy.visit('/dashboard/ingredients');
    cy.get('#add-ingredient-btn').click();
    const uniqueName = `Pasta-${Date.now()}`;
    cy.get('input[name="ingredientName"]').type(uniqueName).blur();
    cy.wait(500);

    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); const tomorrowStr = tomorrow.toISOString().split('T')[0];
    cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');
    cy.wait(1000);

    cy.get('button[name="mealType"][value="lunch"]').click();
    cy.wait(500);

    cy.get('select[name="lunch-dishId"]').last().select(uniqueName);
    cy.get('input[name="amount"]').first().type('100').blur();

    cy.wait(500);
    cy.contains(uniqueName).parents('.grid').find('input[name="amount"]').first().clear().type('200').blur();

    cy.wait(500);
    cy.reload();
    cy.contains(uniqueName).parents('.grid').find('input[name="amount"]').first().should('have.value', '200');
  });

  it('allows user to remove dish from meal', () => {
    cy.visit('/dashboard/ingredients');
    cy.get('#add-ingredient-btn').click();
    const uniqueName = `Removable-Dish-${Date.now()}`;
    cy.get('input[name="ingredientName"]').type(uniqueName).blur();
    cy.wait(500);

    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); const tomorrowStr = tomorrow.toISOString().split('T')[0];
    cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');
    cy.wait(500);

    cy.get('button[name="mealType"][value="breakfast"]').click();
    cy.wait(500);

    cy.get('select[name="breakfast-dishId"]').last().select(uniqueName);
    cy.get('input[name="amount"]').first().type('100').blur();

    cy.wait(500);
    cy.contains(uniqueName).should('be.visible');

    cy.contains(uniqueName).parents('.grid').find('button[hx-delete]').first().click();

    cy.wait(500);
    cy.contains(uniqueName).should('not.exist');
  });

  it('allows user to remove meal from day', () => {
    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); const tomorrowStr = tomorrow.toISOString().split('T')[0];
    cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');
    cy.wait(1000);

    cy.get('button[name="mealType"][value="breakfast"]').click();

    cy.wait(500);
    cy.contains('Reggeli').should('be.visible');

    cy.contains('Reggeli').parent().find('button[hx-delete]').click();

    cy.wait(500);
    cy.get('button[name="mealType"][value="breakfast"]').should('be.visible');
  });

  it.skip('displays validation error for invalid date format', () => {
    cy.get('#add-day-btn').click();
    cy.get('input[name="date"]').type('invalid').blur();

    cy.contains('Invalid date').should('be.visible');
  });

  it.skip('displays validation error for missing dish selection', () => {
    cy.get('#add-day-btn').click();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); const tomorrowStr = tomorrow.toISOString().split('T')[0];
    cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');
    cy.wait(500);

    cy.contains('Reggeli').parent().find('button').contains('+').click();

    cy.wait(500);
    cy.get('input[name="amount"]').first().type('100');
    cy.get('form').first().submit();

    cy.contains('Please select').should('be.visible');
  });

  it('displays nutrition stats for the day', () => {
    cy.visit('/dashboard/ingredients');
    cy.get('#add-ingredient-btn').click();
    const uniqueName = `Chicken-${Date.now()}`;
    cy.get('input[name="ingredientName"]').type(uniqueName).blur();
    cy.wait(500);
    cy.get('input[name="calories"]').clear().type('165').blur();
    cy.get('input[name="carbs"]').clear().type('0').blur();
    cy.get('input[name="fat"]').clear().type('3.6').blur();
    cy.wait(500);

    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); const tomorrowStr = tomorrow.toISOString().split('T')[0];
    cy.get('input[name="date"]').invoke('val', tomorrowStr).trigger('change');
    cy.wait(500);

    cy.get('button[name="mealType"][value="breakfast"]').click();
    cy.wait(500);

    cy.get('select[name="breakfast-dishId"]').last().select(uniqueName);
    cy.get('input[name="amount"]').first().type('100').blur();

    cy.wait(500);
    cy.contains('165').should('be.visible');
  });
});
