Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: '/login',
    form: true,
    body: {
      password: 'admin',
    },
  });
  cy.getCookie('loggedIn').should('exist');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}

export {};
