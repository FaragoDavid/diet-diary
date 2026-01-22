Cypress.Commands.add('login', () => {
  cy.visit('/test-login');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}

export {};
