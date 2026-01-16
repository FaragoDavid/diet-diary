import { stats } from '../../src/components/stats';
import { HTMX_SWAP } from '../../src/utils/htmx';

describe('Stats Component', () => {
  const macroAmounts = {
    cal: 100,
    carbs: 50,
    fat: 20,
  };

  beforeEach(() => {
    cy.visit('/public/test-components.html');
  });

  const renderComponent = (html: string) => {
    cy.get('#test-container').then(($el) => {
      $el[0].innerHTML = html;
    });
  };

  describe('vertical layout', () => {
    it('renders with id', () => {
      const html = stats(macroAmounts, { layout: 'vertical', id: 'test-id' });
      renderComponent(html);
      cy.get('#test-id').should('exist');
    });

    it('renders with size classes', () => {
      const htmlLg = stats(macroAmounts, { layout: 'vertical', size: 'lg' });
      renderComponent(htmlLg);
      cy.get('.flex.text-lg').should('exist');

      const htmlSm = stats(macroAmounts, { layout: 'vertical', size: 'sm' });
      renderComponent(htmlSm);
      cy.get('.flex.text-sm').should('exist');
    });

    it('renders with span class', () => {
      const html = stats(macroAmounts, { layout: 'vertical', span: 'col-span-2' });
      renderComponent(html);
      cy.get('.flex.col-span-2').should('exist');
    });

    it('renders with swapOob replace element', () => {
      const html = stats(macroAmounts, { layout: 'vertical', swapOob: HTMX_SWAP.ReplaceElement });
      renderComponent(html);
      cy.get(`[hx-swap-oob="${HTMX_SWAP.ReplaceElement}"]`).should('exist');
    });

    it('renders all macros', () => {
      const html = stats(macroAmounts, { layout: 'vertical' });
      renderComponent(html);
      cy.contains('Kal').should('exist');
      cy.contains('100').should('exist');
      cy.contains('CH').should('exist');
      cy.contains('50').should('exist');
      cy.contains('zsír').should('exist');
      cy.contains('20').should('exist');
    });
  });

  describe('horizontal layout', () => {
    it('renders all macros', () => {
      const html = stats(macroAmounts, { layout: 'horizontal' });
      renderComponent(html);
      cy.contains('Kal: 100').should('exist');
      cy.contains('CH: 50').should('exist');
      cy.contains('zsír: 20').should('exist');
    });

    it('renders with size classes', () => {
      const htmlLg = stats(macroAmounts, { layout: 'horizontal', size: 'lg' });
      renderComponent(htmlLg);
      cy.get('.flex').should('exist');
      cy.get('.text-lg').should('exist');
    });
  });

  describe('cells layout', () => {
    it('renders all macros', () => {
      const html = stats(macroAmounts, { layout: 'cells' });
      renderComponent(html);
      cy.contains('Kal: 100').should('exist');
      cy.contains('CH: 50').should('exist');
      cy.contains('zsír: 20').should('exist');
    });

    it('renders with size classes', () => {
      const htmlLg = stats(macroAmounts, { layout: 'cells', size: 'lg' });
      renderComponent(htmlLg);
      cy.get('.text-lg').should('have.length.at.least', 3);

      const htmlSm = stats(macroAmounts, { layout: 'cells', size: 'sm' });
      renderComponent(htmlSm);
      cy.get('.text-sm').should('have.length.at.least', 3);
    });
  });
});
