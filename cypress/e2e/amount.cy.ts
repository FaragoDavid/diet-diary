import { amount } from '../../src/components/amount';
import { HTMX_SWAP } from '../../src/utils/htmx';

describe('Amount Input Component', () => {
  beforeEach(() => {
    cy.visit('/public/test-amount.html');
  });

  const renderComponent = (html: string) => {
    cy.window().then((win) => {
      (win as any).renderComponent(html);
    });
  };

  it('renders input with id', () => {
    const id = 'test-id';
    const html = amount({ id });

    renderComponent(html);

    cy.get(`#${id}`).should('exist');
    cy.get(`#${id} input[type="number"]`).should('exist');
    cy.get(`#${id} span`).should('contain.text', 'g');
  });

  it('renders input with default value', () => {
    const testAmount = 100;
    const html = amount({ amount: testAmount });

    renderComponent(html);

    cy.get('input[type="number"]').should('have.value', testAmount.toString());
  });

  it('renders input with name', () => {
    const name = 'test-name';
    const html = amount({ name });

    renderComponent(html);

    cy.get(`input[name="${name}"]`).should('exist');
  });

  it('renders input with text', () => {
    const html = amount({ showText: true });

    renderComponent(html);

    cy.get('.text').should('contain.text', 'Menny.');
  });

  it('renders input with placeholder', () => {
    const html = amount({});

    renderComponent(html);

    cy.get('input[type="number"]').should('have.attr', 'placeholder', '0');
  });

  describe('with hx option', () => {
    it('renders input with required htmx attributes', () => {
      const hx = {
        verb: 'get' as const,
        url: 'test-url',
      };
      const html = amount({ hx });

      renderComponent(html);

      cy.get('input[type="number"]').should('have.attr', 'hx-get', hx.url);
    });

    it('renders input with htmx target attribute', () => {
      const hx = {
        verb: 'get' as const,
        url: 'test-url',
        target: 'test-target',
      };
      const html = amount({ hx });

      renderComponent(html);

      cy.get('input[type="number"]').should('have.attr', 'hx-get', hx.url).should('have.attr', 'hx-target', hx.target);
    });

    it('renders input with htmx swap attribute', () => {
      const hx = {
        verb: 'get' as const,
        url: 'test-url',
        swap: HTMX_SWAP.AfterElement,
      };
      const html = amount({ hx });

      renderComponent(html);

      cy.get('input[type="number"]').should('have.attr', 'hx-get', hx.url).should('have.attr', 'hx-swap', hx.swap);
    });

    it('renders input with htmx include attribute', () => {
      const hx = {
        verb: 'get' as const,
        url: 'test-url',
        include: 'test-include',
      };
      const html = amount({ hx });

      renderComponent(html);

      cy.get('input[type="number"]').should('have.attr', 'hx-get', hx.url).should('have.attr', 'hx-include', hx.include);
    });

    it('renders input with htmx trigger attribute', () => {
      const hx = {
        verb: 'get' as const,
        url: 'test-url',
        trigger: 'test-trigger',
      };
      const html = amount({ hx });

      renderComponent(html);

      cy.get('input[type="number"]').should('have.attr', 'hx-get', hx.url).should('have.attr', 'hx-trigger', hx.trigger);
    });

    it('renders input with post verb', () => {
      const hx = {
        verb: 'post' as const,
        url: 'test-url',
      };
      const html = amount({ hx });

      renderComponent(html);

      cy.get('input[type="number"]').should('have.attr', 'hx-post', hx.url);
    });
  });

  describe('interactive behavior', () => {
    it('allows user to type a value', () => {
      const html = amount({});

      renderComponent(html);

      cy.get('input[type="number"]').type('150').should('have.value', '150');
    });

    it('accepts decimal values', () => {
      const html = amount({});

      renderComponent(html);

      cy.get('input[type="number"]').type('99.5').should('have.value', '99.5');
    });

    it('has proper styling classes', () => {
      const html = amount({});

      renderComponent(html);

      cy.get('input[type="number"]').should('have.class', 'input').should('have.class', 'input-sm').should('have.class', 'input-bordered');
    });
  });
});
