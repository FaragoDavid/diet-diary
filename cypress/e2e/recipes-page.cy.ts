describe('Recipe Dialog — add ingredient', () => {
  beforeEach(() => {
    cy.visit('/recipes');
    cy.contains('button', 'Csirkemell brokkolival').click();
    cy.get('dialog[open]').should('exist');
  });

  it('focuses the amount input after adding an ingredient', () => {
    cy.get('dialog input[placeholder="Alapanyag hozzáadása..."]').type('Rizs');
    cy.get('dialog .menu button').contains('Rizs').click();
    cy.get('input[data-ingredient-id="ing-3"]').should('have.focus');
  });

  it('does not default the amount to 100', () => {
    cy.get('dialog input[placeholder="Alapanyag hozzáadása..."]').type('Rizs');
    cy.get('dialog .menu button').contains('Rizs').click();
    cy.get('input[data-ingredient-id="ing-3"]').should('have.value', '');
  });
});
