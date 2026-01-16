import { BackLink } from '../../src/components/back-link';

describe('Back Link Component', () => {
  beforeEach(() => {
    cy.visit('/public/test-components.html');
  });

  const renderComponent = async (target: string) => {
    const component = new BackLink(target);
    const html = await component.render();
    cy.get('#test-container').then(($el) => {
      $el[0].innerHTML = html;
    });
  };

  it('renders the back link correctly', () => {
    const target = 'test-target';
    cy.wrap(null).then(() => renderComponent(target));

    cy.get('a').should('have.attr', 'href', `/dashboard/${target}`);
    cy.get('a').should('have.class', 'fixed');
    cy.get('a').should('have.class', 'bg-base-200');
    cy.get('button').should('have.class', 'btn-sm');
  });
});
