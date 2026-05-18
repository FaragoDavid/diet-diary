describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should auto-login with mock user in dev mode and show Dashboard', () => {
    cy.contains('Diet Diary').should('be.visible');
    cy.contains('Dev User').should('be.visible');
    cy.contains('button', 'Sign out').should('be.visible');
  });

  it('should show sign-out button that triggers sign-out', () => {
    cy.contains('button', 'Sign out').should('be.enabled');
  });
});
