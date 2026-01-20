describe('Meal Management', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/dashboard/meals');
  });

  it('allows user to create a new day', () => {
    cy.get('#add-day-btn').click();

    const today = new Date().toISOString().split('T')[0];
    cy.get('input[name="date"]').type(today).blur();

    cy.wait(500);
    cy.url().should('include', '/day/');
    cy.contains(new Date().getFullYear()).should('be.visible');
  });

  it('allows user to add meals to a day', () => {
    cy.get('#add-day-btn').click();
    const today = new Date().toISOString().split('T')[0];
    cy.get('input[name="date"]').type(today).blur();
    cy.wait(500);

    cy.contains('Reggeli').parent().find('button').contains('+').click();

    cy.wait(500);
    cy.contains('Reggeli').should('be.visible');
  });

  it('allows user to add ingredient dish to a meal', () => {
    cy.visit('/dashboard/ingredients');
    cy.get('#add-ingredient-btn').click();
    cy.get('input[name="ingredientName"]').type('Rice').blur();
    cy.wait(500);

    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();
    const today = new Date().toISOString().split('T')[0];
    cy.get('input[name="date"]').type(today).blur();
    cy.wait(500);

    cy.get('button').contains('+').first().click();
    cy.wait(500);

    cy.get('select').first().select('Rice');
    cy.get('input[name="amount"]').first().type('150').blur();

    cy.wait(500);
    cy.contains('Rice').should('be.visible');
  });

  it('allows user to add recipe dish to a meal', () => {
    cy.visit('/dashboard/recipes');
    cy.get('#add-recipe-btn').click();
    cy.get('input[name="recipeName"]').type('Breakfast Bowl').blur();
    cy.wait(500);

    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();
    const today = new Date().toISOString().split('T')[0];
    cy.get('input[name="date"]').type(today).blur();
    cy.wait(500);

    cy.get('button').contains('+').first().click();
    cy.wait(500);

    cy.get('select').first().select('Breakfast Bowl');
    cy.get('input[name="amount"]').first().type('1').blur();

    cy.wait(500);
    cy.contains('Breakfast Bowl').should('be.visible');
  });

  it('allows user to update dish amount', () => {
    cy.visit('/dashboard/ingredients');
    cy.get('#add-ingredient-btn').click();
    cy.get('input[name="ingredientName"]').type('Pasta').blur();
    cy.wait(500);

    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();
    const today = new Date().toISOString().split('T')[0];
    cy.get('input[name="date"]').type(today).blur();
    cy.wait(500);

    cy.get('button').contains('+').eq(1).click();
    cy.wait(500);

    cy.get('select').first().select('Pasta');
    cy.get('input[name="amount"]').first().type('100').blur();

    cy.wait(500);
    cy.contains('Pasta').parents('.grid').find('input[name="amount"]').first().clear().type('200').blur();

    cy.wait(500);
    cy.reload();
    cy.contains('Pasta').parents('.grid').find('input[name="amount"]').first().should('have.value', '200');
  });

  it('allows user to remove dish from meal', () => {
    cy.visit('/dashboard/ingredients');
    cy.get('#add-ingredient-btn').click();
    cy.get('input[name="ingredientName"]').type('Removable Dish').blur();
    cy.wait(500);

    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();
    const today = new Date().toISOString().split('T')[0];
    cy.get('input[name="date"]').type(today).blur();
    cy.wait(500);

    cy.get('button').contains('+').first().click();
    cy.wait(500);

    cy.get('select').first().select('Removable Dish');
    cy.get('input[name="amount"]').first().type('100').blur();

    cy.wait(500);
    cy.contains('Removable Dish').should('be.visible');

    cy.contains('Removable Dish').parents('.grid').find('button[hx-delete]').click();

    cy.wait(500);
    cy.contains('Removable Dish').should('not.exist');
  });

  it('allows user to remove meal from day', () => {
    cy.get('#add-day-btn').click();
    const today = new Date().toISOString().split('T')[0];
    cy.get('input[name="date"]').type(today).blur();
    cy.wait(500);

    cy.contains('Reggeli').parent().find('button').contains('+').click();

    cy.wait(500);
    cy.contains('Reggeli').should('be.visible');

    cy.contains('Reggeli').parent().find('button').contains('×').click();

    cy.wait(500);
    cy.contains('Reggeli').should('not.be.visible');
  });

  it.skip('displays validation error for invalid date format', () => {
    cy.get('#add-day-btn').click();
    cy.get('input[name="date"]').type('invalid').blur();

    cy.contains('Invalid date').should('be.visible');
  });

  it.skip('displays validation error for missing dish selection', () => {
    cy.get('#add-day-btn').click();
    const today = new Date().toISOString().split('T')[0];
    cy.get('input[name="date"]').type(today).blur();
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
    cy.get('input[name="ingredientName"]').type('Chicken').blur();
    cy.wait(500);
    cy.get('input[name="calories"]').clear().type('165').blur();
    cy.get('input[name="carbs"]').clear().type('0').blur();
    cy.get('input[name="fat"]').clear().type('3.6').blur();
    cy.wait(500);

    cy.visit('/dashboard/meals');
    cy.get('#add-day-btn').click();
    const today = new Date().toISOString().split('T')[0];
    cy.get('input[name="date"]').type(today).blur();
    cy.wait(500);

    cy.get('button').contains('+').first().click();
    cy.wait(500);

    cy.get('select').first().select('Chicken');
    cy.get('input[name="amount"]').first().type('100').blur();

    cy.wait(500);
    cy.contains('165').should('be.visible');
  });
});
